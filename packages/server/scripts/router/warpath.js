import { Router } from 'express';
import { sendJson } from '../utils';

import axios from 'axios';

export const warpathRouter = Router();

const getGuildMember = async (gid, day) => {
  const guildMemberUrl = 'https://jk.dmzgame.com/warpath/guild_member';
  const res = await axios.get(guildMemberUrl, {
    params: {
      gid,
      day,
    },
  });
  return res.data.Data;
};

const getServerRank = async (extraParams) => {
  const url = 'https://jk.dmzgame.com/warpath/rank_pid';

  const params = {
    day: 20240108,
    wid: 15,
    ccid: 0,
    rank: 'sumkill',
    is_benfu: 1,
    is_quanfu: 0,
    page: 1,
    perPage: 500,
    ...extraParams,
  };

  const res = await axios.get(url, {
    params,
  });

  // const guildMembers = res.data.Data.map((item) => item.pid);
  //
  // return Promise.all(
  //   guildMembers.map((pid) => {
  //     return getPidDetail(pid, 1);
  //   }),
  // ).then((res) => {
  //   return res.reduce((acc, cur) => {
  //     return acc.concat(cur.data[0]);
  //   }, []);
  // });
  return res.data.Data;
};

const getPidDetail = async (pid, perPage) => {
  const guildMemberUrl = 'https://jk.dmzgame.com/warpath/pid_detail';

  const res = await axios
    .get(guildMemberUrl, {
      params: {
        pid,
        // 当前页
        page: 1,
        // 每页显示多少条
        perPage: perPage || 30,
      },
    })
    .catch((err) => {
      return err;
    });
  return {
    pid,
    data: res.data.Data,
  };
};

const guildMember = async (req, res) => {
  const { gid, day } = req.query || {};

  const data = await getGuildMember(gid, day);

  return sendJson(res, data);
};

const pidDetail = async (req, res) => {
  const { pid, page, perPage } = req.query || {};

  const guildMemberUrl = 'https://jk.dmzgame.com/warpath/pid_detail';

  const { Data } = await axios
    .get(guildMemberUrl, {
      params: {
        pid,
        // 当前页
        page,
        // 每页显示多少条
        perPage,
      },
    })
    .catch((err) => {
      return err;
    });

  return sendJson(res, Data);
};

const guildMemberDetails = async (req, res) => {
  const { gid, days } = req.body || {};

  const data = await Promise.all(
    days.map((day) => {
      return getGuildMember(gid, day);
    }),
  ).then((res) => {
    const guildMembers = res.reduce((acc, data) => {
      const newData = [];

      data.forEach((item) => {
        const record = acc.includes(item.pid);
        if (!record) {
          newData.push(item.pid);
        }
      });
      return acc.concat(newData);
    }, []);

    const perPage = days.length;

    return Promise.all(
      guildMembers.map((pid) => {
        return getPidDetail(pid, perPage);
      }),
    ).then((res) => {
      return res.reduce((acc, cur) => {
        return acc.concat(cur);
      }, []);
    });
  });

  return sendJson(res, data);
};

const guildMembers = async (req, res) => {
  const { gid, days } = req.body || {};

  const data = await Promise.all(
    days.map((day) => {
      return getGuildMember(gid, day);
    }),
  ).then((res) => {
    return res.reduce((acc, data) => {
      const newData = [];

      data.forEach((item) => {
        const record = acc.find((record) => record.pid === item.pid);
        if (!record) {
          newData.push(item);
        }
      });

      return acc.concat(newData);
    }, []);
  });
  return sendJson(res, data);
};

const serverRanks = async (req, res) => {
  const { wid, days } = req.body || {};

  const data = await Promise.all(
    days.map((day) => {
      return getServerRank({
        wid,
        day,
      });
    }),
  ).then((res) => {
    return res.reduce((acc, data) => {
      const newData = [];

      data.forEach(async (item) => {
        const record = acc.find((record) => record.pid === item.pid);
        if (!record) {
          // const { powers } = item || {};
          //
          // const newMaxPower = Object.keys(powers || {}).reduce((acc, key) => {
          //   if (key === 'total') {
          //     return acc;
          //   }
          //   return acc + powers[key];
          // }, 0);

          newData.push({
            ...item,
            // newMaxPower,
          });
        }
      });

      return acc.concat(newData);
    }, []);
  });

  const newData = data.sort((cur, prev) => prev.maxpower - cur.maxpower).slice(0, 200);

  return sendJson(res, newData);
};

const serversRank = async (req, res) => {
  const { day, server = 2, sort = 200 } = req.body || {};

  const data = await Promise.all(
    Array.from({
      length: server,
    }).map((_, index) => {
      return getServerRank({
        wid: index + 1,
        day,
      });
    }),
  ).then((res) => {
    return res.reduce((acc, data, currentIndex) => {
      const newData = data.sort((cur, prev) => prev.maxpower - cur.maxpower).slice(0, sort);

      return acc.concat({
        data: newData,
        server: currentIndex + 1,
        total: newData.reduce((total, cur) => {
          return total + cur.maxpower;
        }, 0),
      });
    }, []);
  });

  return sendJson(res, data);
};

warpathRouter.get('/local-api/warpath/guildMember', guildMember);
warpathRouter.post('/local-api/warpath/guildMember', guildMembers);
warpathRouter.post('/local-api/warpath/guildMemberDetails', guildMemberDetails);
warpathRouter.post('/local-api/warpath/serverRank', serverRanks);
warpathRouter.get('/local-api/warpath/pidDetail', pidDetail);
warpathRouter.post('/local-api/warpath/serversRank', serversRank);
