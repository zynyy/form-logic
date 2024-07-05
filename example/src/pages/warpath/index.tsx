import { useState } from 'react';
import dayjs from 'dayjs';
import { Button, DatePicker, Form, InputNumber, Select, Space, Table } from 'antd';
import * as XLSX from 'xlsx';
import { requestPost } from '@/utils/request';

const { RangePicker } = DatePicker;

const guild = {
  // 日期
  day: 20231214,
  // 游戏id
  pid: 1631641,
  // 服务器
  wid: 15,
  // 工会
  gnick: 'CBA',
  // 城市等级
  lv: 32,
  // 昵称
  nick: '热血丶川崎',
  // 历史最高战力
  maxpower: 376520358,
  // 总击杀
  sumkill: 3206030,
  // 积分
  score: 1217755750,
  // 军衔击杀数
  kills: [],
  // 死亡数
  die: 520872,
};

const options = [
  { value: '82118', label: 'CBA-涅槃' },
  { value: '68378', label: 'XIII-城市猎人' },
  { value: '19397', label: 'STAR-璀璨星空' },
  { value: '75517', label: 'FA-情谊FA' },
  { value: '119136', label: 'DK-龍骧' },
  { value: '53571', label: 'GYB-雇佣兵' },
  { value: '172898', label: 'XY-星月' },
  { value: '174558', label: 'AMD-铁血军团' },
  { value: '138460', label: 'ZGSY-折桂书院' },
  { value: '100283', label: 'bl-兵临城下' },
  { value: '160073', label: 'PTU-陷阵' },
  { value: '191099', label: 'YSZ-隐世族' },
  { value: '152743', label: 'HS1-横扫一切' },
  { value: '7124', label: 'CFPL-长风' },
  { value: '44118', label: 'QvQ-金刚葫芦娃' },
];

const Warpath = () => {
  const [info, setInfo] = useState({
    gNick: '',
    startDate: '',
    endDate: '',
  });

  const [maxPower, setMaxPower] = useState(0);

  const [form] = Form.useForm();

  const getKills = (prefixData) => {
    return Array.from({ length: 15 }).map((_, index) => {
      return {
        title: `${index + 1}阶`,
        dataIndex: `${prefixData || ''}Rank${index + 1}`,
        render: (val) => {
          return val > 0 ? val : null;
        },
      };
    });
  };

  const getKillsData = (prefixData) => {
    const kill = {};
    Array.from({ length: 15 }).forEach((_, index) => {
      kill[`${prefixData || ''}Rank${index + 1}`] = 1212;
    });
    return kill;
  };

  const formatData = (prefixData, item) => {
    const rank = {};

    item.kills.forEach((val, index) => {
      rank[`${prefixData}Rank${index + 1}`] = val;
    });

    return {
      [`${prefixData}Date`]: item.day,
      [`${prefixData}Nick`]: item.nick,
      [`${prefixData}MaxPower`]: item.maxpower,
      [`${prefixData}Die`]: item.die,
      [`${prefixData}Score`]: item.score,
      [`${prefixData}SumKill`]: item.sumkill,
      ...rank,
    };
  };

  const [dataSource, setData] = useState([
    {
      pid: '1631641',
      nick: '测试',
      diffDate: '20231215~20240105',
      diffPower: 1212,
      diffDie: 1111,
      diffScore: 11212,
      diffSumKill: 112122,
      ...getKillsData('diff'),
      ...getKillsData('start'),
      ...getKillsData('end'),
      ...formatData('start', guild),
      ...formatData('end', guild),
    },
  ]);

  const [columns, setColumns] = useState<any[]>([
    {
      title: 'pid',
      dataIndex: 'pid',
    },
    {
      title: '昵称',
      dataIndex: 'nick',
    },
    {
      title: '统计日期日期',
      dataIndex: 'diffDate',
    },
    {
      title: '历史最高战力',
      dataIndex: 'diffPower',
    },
    {
      title: '死亡数',
      dataIndex: 'diffDie',
    },
    {
      title: '击杀积分',
      dataIndex: 'diffScore',
    },
    {
      title: '击杀数',
      dataIndex: 'diffSumKill',
    },
    {
      title: '死亡比',
      dataIndex: 'diff',
    },
    ...getKills('diff'),
    {
      title: '统计日期',
      dataIndex: 'startDate',
    },
    {
      title: '昵称',
      dataIndex: 'startNick',
    },
    {
      title: '历史最高战力',
      dataIndex: 'startMaxPower',
    },
    {
      title: '死亡数',
      dataIndex: 'startDie',
    },
    {
      title: '击杀积分',
      dataIndex: 'startScore',
    },
    {
      title: '击杀数',
      dataIndex: 'startSumKill',
    },
    ...getKills('start'),
    {
      title: '统计日期',
      dataIndex: 'endDate',
    },
    {
      title: '昵称',
      dataIndex: 'endNick',
    },
    {
      title: '历史最高战力',
      dataIndex: 'endMaxPower',
    },
    {
      title: '死亡数',
      dataIndex: 'endDie',
    },
    {
      title: '击杀积分',
      dataIndex: 'endScore',
    },
    {
      title: '击杀数',
      dataIndex: 'endSumKill',
    },
    ...getKills('start'),
  ]);

  const handleClick = () => {
    const dom = document.querySelector('.ant-table-container table');
    if (dom) {
      const workbook = XLSX.utils.book_new();
      const sheet = XLSX.utils.table_to_sheet(dom);
      XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');

      const { gNick, startDate, endDate } = info || {};

      XLSX.writeFile(workbook, `${gNick}-${startDate}~${endDate}统计数据.xlsx`);
    }
  };

  const searchClick = () => {
    form.validateFields(['gid', 'rangeDate']).then((values) => {
      const { gid, rangeDate } = values;

      const [startDate, endDate] = rangeDate || [];

      setInfo({
        gNick: options.find((cur) => cur.value === gid)?.label || '',
        startDate: startDate.format('YYYYMMDD'),
        endDate: endDate.format('YYYYMMDD'),
      });

      const diffDay = dayjs(endDate).diff(startDate, 'day');

      const days = Array.from({
        length: diffDay + 10,
      }).map((_, index) => {
        return dayjs(startDate).add(index, 'day').format('YYYYMMDD');
      });
      //
      requestPost('/local-api/warpath/guildMemberDetails', {
        gid: Number(gid),
        days,
      }).then((res) => {
        const { data } = res;

        const diffData = (first, last) => {
          const { kills } = last;

          const rank = {};

          kills.forEach((val, index) => {
            rank[`diffRank${index + 1}`] = val - first.kills[index];
          });

          const diffDie = last.die - first.die;
          const diffSumKill = last.sumkill - first.sumkill;

          return {
            diffDate: `${first.day}~${last.day}`,
            diffPower: last.maxpower - first.maxpower,
            diffDie,
            diffScore: last.score - first.score,
            diffSumKill,
            diff: diffSumKill - diffDie,
            ...rank,
          };
        };

        const newData = data.map((item) => {
          const rows = item.data;

          if (rows.length) {
            const first =
              rows.find((item) => {
                return `${item.day}` === startDate.format('YYYYMMDD');
              }) || rows[0];
            const last =
              rows.find((item) => {
                return `${item.day}` === endDate.format('YYYYMMDD');
              }) || rows[rows.length - 1];

            return {
              pid: item.pid,
              nick: first.nick,
              ...diffData(first, last),
              ...formatData('end', last),
              ...formatData('start', first),
            };
          }

          return {
            pid: item.pid,
          };
        });

        setData(newData);
      });
    });
  };

  const searchRankClick = () => {
    form.validateFields(['wid', 'rangeDate']).then((values) => {
      const { wid, rangeDate } = values;

      const [startDate, endDate] = rangeDate || [];

      setInfo({
        gNick: `${wid}服`,
        startDate: startDate.format('YYYYMMDD'),
        endDate: endDate.format('YYYYMMDD'),
      });

      const diffDay = dayjs(endDate).diff(startDate, 'day');

      const days = Array.from({
        length: diffDay + 1,
      }).map((_, index) => {
        return dayjs(startDate).add(index, 'day').format('YYYYMMDD');
      });
      //
      requestPost('/local-api/warpath/serverRank', {
        wid: Number(wid),
        days: days.reverse(),
      }).then((res) => {
        const { data } = res;

        const newData = data.map((item) => {
          return {
            ...item,
            diff: item.sumkill - item.die,
          };
        });

        setData(newData);

        setColumns([
          {
            title: 'pid',
            dataIndex: 'pid',
          },
          {
            title: '昵称',
            dataIndex: 'nick',
          },
          {
            title: '所属联盟',
            dataIndex: 'gnick',
          },
          {
            title: '统计日期日期',
            dataIndex: 'day',
          },
          {
            title: '历史最高战力',
            dataIndex: 'maxpower',
          },
          {
            title: '死亡数',
            dataIndex: 'die',
          },
          {
            title: '击杀积分',
            dataIndex: 'score',
          },
          {
            title: '击杀数',
            dataIndex: 'sumkill',
          },
          // {
          //   title: '科技战力',
          //   dataIndex: ['powers', 'tech'],
          // },
          // {
          //   title: '军官战力',
          //   dataIndex: ['powers', 'officer'],
          // },
          // {
          //   title: '建筑战力',
          //   dataIndex: ['powers', 'user_city_building'],
          // },
          // {
          //   title: '部队战力',
          //   dataIndex: ['powers', 'army'],
          // },
          // {
          //   title: '兵卡战力',
          //   dataIndex: ['powers', 'equip'],
          // },
          // {
          //   title: '阵营战力',
          //   dataIndex: ['powers', 'camp'],
          // },
          // {
          //   title: '矿车战力',
          //   dataIndex: ['powers', 'mine_vehicle'],
          // },
        ]);
        setMaxPower(
          newData.reduce((acc, cur) => {
            return acc + cur.maxpower;
          }, 0),
        );
      });
    });
  };

  const searchRanksClick = () => {
    const workbook = XLSX.utils.book_new();

    const headerColumn = {
      pid: 'pid',
      nick: '昵称',
      gnick: '所属联盟',
      day: '统计日期',
      power: '战力',
      maxpower: '历史最高战力',
      die: '死亡数',
      score: '击杀积分',
      sumkill: '击杀数',
    };

    const data: any = [];

    const totalSheetColumn = {
      server: '服务器',
      day: '统计日期',
      total: '前200历史总战力',
    };

    //

    form.validateFields(['wid']).then((values) => {
      const { wid, sort } = values;

      const day = dayjs().subtract(2, 'day').format('YYYYMMDD');

      requestPost('/local-api/warpath/serversRank', {
        server: Number(wid),
        day,
        sort: sort ?? 200,
      }).then((res) => {
        const { data } = res;

        const totalSheetData = data
          .map((item) => {
            const { server, total } = item;
            return {
              total,
              server,
              day,
            };
          })
          .sort((cur, prev) => prev.total - cur.total);

        const totalSheet = XLSX.utils.json_to_sheet([totalSheetColumn].concat(totalSheetData), {
          header: ['server', 'day', 'total'],
          skipHeader: true,
        });

        XLSX.utils.book_append_sheet(workbook, totalSheet, `战力汇总`);

        data.forEach((item) => {
          const { server, total } = item;
          const sheet = XLSX.utils.json_to_sheet(
            [headerColumn].concat(
              item.data.map((cur) => {
                const record = {};

                Object.keys(headerColumn).forEach((key) => {
                  record[key] = cur[key];
                });

                return record;
              }),
            ),
            {
              header: ['pid', 'nick', 'gnick', 'day', 'maxpower', 'die', 'score', 'sumkill'],
              skipHeader: true,
            },
          );

          XLSX.utils.book_append_sheet(workbook, sheet, `${server}服名单`);
        });

        XLSX.writeFile(workbook, `1～${wid}服-${day}统计数据.xlsx`);
      });
    });
  };

  const renderTitle = () => {
    return (
      <>
        <Form
          form={form}
          layout="inline"
          initialValues={{
            rangeDate: [dayjs('20240422'), dayjs('20240510')],
          }}
        >
          <Form.Item label="联盟" name="gid" rules={[{ required: true, message: '请选择联盟' }]}>
            <Select options={options} style={{ width: 200 }} />
          </Form.Item>

          <Form.Item
            label="日期范围"
            name="rangeDate"
            rules={[{ required: true, message: '请选择日期范围' }]}
          >
            <RangePicker />
          </Form.Item>

          <Form.Item
            label="服务器"
            name="wid"
            rules={[{ required: true, message: '请输入服务器' }]}
          >
            <InputNumber style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="sort" name="sort">
            <InputNumber style={{ width: 200 }} />
          </Form.Item>
        </Form>

        <Space>
          <span>{maxPower}</span>
          <Button onClick={searchClick}>查询数据</Button>
          <Button onClick={searchRankClick}>查询最高记录200强数据</Button>
          <Button onClick={searchRanksClick}>查询服务器集合最高记录200强数据</Button>
          <Button onClick={handleClick}>导出数据</Button>
        </Space>
      </>
    );
  };

  return (
    <Table
      pagination={false}
      rowKey="pid"
      title={renderTitle}
      columns={columns}
      dataSource={dataSource}
    />
  );
};

export default Warpath;
