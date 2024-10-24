import { useState } from 'react';
import dayjs from 'dayjs';
import { Button, DatePicker, Form, InputNumber, Select, Space, Table } from 'antd';
import * as XLSX from 'xlsx';
import { requestPost } from '@/utils/request';

const RangePicker = DatePicker.RangePicker;

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

const options =[
  {
    "value": 20382,
    "label": "7_313-无名"
  },
  {
    "value": 191099,
    "label": "23_YSZ-天枢"
  },
  {
    "value": 236724,
    "label": "25_MTR-墨天阁"
  },
  {
    "value": 119136,
    "label": "17_MB-隔壁麻辣"
  },
  {
    "value": 19397,
    "label": "6_STAR-璀璨星空"
  },
  {
    "value": 34202,
    "label": "9_FA.-情.谊"
  },
  {
    "value": 134686,
    "label": "18_Vega-北極星"
  },
  {
    "value": 66137,
    "label": "12_Hi-你好"
  },
  {
    "value": 152743,
    "label": "20_HOME-龍城飛將"
  },
  {
    "value": 245833,
    "label": "26_XXVI-S议会"
  },
  {
    "value": 70659,
    "label": "12_Qs-白金瀚"
  },
  {
    "value": 147141,
    "label": "19_7th-第七天堂"
  },
  {
    "value": 174558,
    "label": "22_AMD-铁血军团"
  },
  {
    "value": 30580,
    "label": "8_8SH-四海"
  },
  {
    "value": 216324,
    "label": "24_XKX-侠客行"
  },
  {
    "value": 44118,
    "label": "10_QvQ-葫芦娃"
  },
  {
    "value": 279083,
    "label": "28_TANG-天策"
  },
  {
    "value": 114647,
    "label": "16_MDCM-盛世"
  },
  {
    "value": 321998,
    "label": "32_MR.-山河"
  },
  {
    "value": 130951,
    "label": "18_Was-哇噻家族"
  },
  {
    "value": 164364,
    "label": "21_Goda-Godaleague"
  },
  {
    "value": 165471,
    "label": "21_Godk-止戈"
  },
  {
    "value": 7124,
    "label": "4_JL.-蛟龙"
  },
  {
    "value": 6317,
    "label": "3_ST00-七星聚天权"
  },
  {
    "value": 53571,
    "label": "11_FREE-破茧"
  },
  {
    "value": 141713,
    "label": "19_HB-1-虎贲军"
  },
  {
    "value": 101466,
    "label": "16_nz1-ヾ南征北战"
  },
  {
    "value": 72609,
    "label": "14_FASS-情谊九霄"
  },
  {
    "value": 155583,
    "label": "20_CH.B-北晋"
  },
  {
    "value": 1016,
    "label": "1_XH-星火"
  },
  {
    "value": 153991,
    "label": "20_ZAFT-七星阁"
  },
  {
    "value": 258796,
    "label": "27_YING-龍影"
  },
  {
    "value": 43389,
    "label": "10_QFG-清风阁"
  },
  {
    "value": 68378,
    "label": "13_XIII-唐门"
  },
  {
    "value": 13880,
    "label": "5_LYJ-狼烟军团"
  },
  {
    "value": 13653,
    "label": "5_YH-炎黄"
  },
  {
    "value": 2648,
    "label": "1_FY-扶摇"
  },
  {
    "value": 82118,
    "label": "15_TIME-时光"
  },
  {
    "value": 229687,
    "label": "24_GAG-夜总会"
  },
  {
    "value": 9445,
    "label": "4_1335-故里有长安"
  },
  {
    "value": 70196,
    "label": "13_Run-纵马关山踏江河"
  },
  {
    "value": 1830,
    "label": "1_JDL-天丨衍"
  },
  {
    "value": 164011,
    "label": "21_Sun-华夏"
  },
  {
    "value": 141687,
    "label": "19_JW-九州丶新大陆"
  },
  {
    "value": 1953,
    "label": "2_SLU-戮杀"
  },
  {
    "value": 36374,
    "label": "8_AL-安东洛夫"
  },
  {
    "value": 160073,
    "label": "21_CIS-长生"
  },
  {
    "value": 300463,
    "label": "31_YC-青青草原"
  },
  {
    "value": 321141,
    "label": "31_YTG-云天阁B"
  },
  {
    "value": 9014,
    "label": "4_Bro-善战"
  },
  {
    "value": 57693,
    "label": "12_PMC-暗影裁决"
  },
  {
    "value": 4152,
    "label": "1_ARMY-红盟"
  },
  {
    "value": 287947,
    "label": "29_BBC-北城"
  },
  {
    "value": 300333,
    "label": "30_ZTJ-遮天剑"
  },
  {
    "value": 34246,
    "label": "9_ig2-IG浮生未歇"
  },
  {
    "value": 1474,
    "label": "2_CANT-七星聚开阳"
  },
  {
    "value": 90677,
    "label": "15_blue-葬爱丶蓝色帝国"
  },
  {
    "value": 7123,
    "label": "4_SAF-烟与花"
  },
  {
    "value": 206692,
    "label": "24_ATG-迪迦军团"
  },
  {
    "value": 2115,
    "label": "2_SZ-沈阳军区"
  },
  {
    "value": 217928,
    "label": "24_WN-A-青云"
  },
  {
    "value": 9297,
    "label": "4_dove-黑色公约"
  },
  {
    "value": 1175,
    "label": "3_FSRM-浮生若梦"
  },
  {
    "value": 414125,
    "label": "37_KLA-柯里昂"
  },
  {
    "value": 1021,
    "label": "1_DAWN-黎明"
  },
  {
    "value": 206243,
    "label": "15_X-W-玄武"
  },
  {
    "value": 223869,
    "label": "25_DAWN-破晓"
  },
  {
    "value": 84179,
    "label": "15_SHE.-过往传说"
  },
  {
    "value": 1616,
    "label": "2_S-九溪烟雨"
  },
  {
    "value": 268049,
    "label": "27_N.Y-南域"
  },
  {
    "value": 76177,
    "label": "14_FAa-情谊道门"
  },
  {
    "value": 331070,
    "label": "31_ZJ-A-仗剑倚青天つ"
  },
  {
    "value": 321997,
    "label": "32_SKY-西凉军团"
  },
  {
    "value": 173008,
    "label": "22_L-Y-揽月"
  },
  {
    "value": 197184,
    "label": "23_J.L-君临天下"
  },
  {
    "value": 37438,
    "label": "9_J8NK-种花家"
  },
  {
    "value": 119490,
    "label": "18_DSH-定山海"
  },
  {
    "value": 227932,
    "label": "25_BFA-北府"
  },
  {
    "value": 88290,
    "label": "11_X-J-仙界"
  },
  {
    "value": 63185,
    "label": "11_Top-新篇章"
  },
  {
    "value": 324588,
    "label": "31_-Gc--菰城"
  },
  {
    "value": 360647,
    "label": "34_AII-天枢"
  },
  {
    "value": 77678,
    "label": "14_FAc-情谊丨帝国"
  },
  {
    "value": 102772,
    "label": "16_nz2-南征北战2"
  },
  {
    "value": 16977,
    "label": "6_GOD-神地"
  },
  {
    "value": 13755,
    "label": "5_That-五丈原"
  },
  {
    "value": 274938,
    "label": "28_TAME-唐盟"
  },
  {
    "value": 15967,
    "label": "6_BOOS-战狼军团"
  },
  {
    "value": 12237,
    "label": "5_CON-统一合作指挥部"
  },
  {
    "value": 20623,
    "label": "7_1949-東部战区"
  },
  {
    "value": 292631,
    "label": "29_H.X-华夏"
  },
  {
    "value": 28691,
    "label": "8_JSCP-聚义基金会"
  },
  {
    "value": 268554,
    "label": "27_MEN-墨门"
  },
  {
    "value": 20547,
    "label": "4_MK-圣火喵喵教"
  },
  {
    "value": 328613,
    "label": "31_Rush-繁花"
  },
  {
    "value": 12687,
    "label": "5_SSa-平安借贷集团"
  },
  {
    "value": 344555,
    "label": "33_TR-征途"
  },
  {
    "value": 36311,
    "label": "8_LION-狮子"
  },
  {
    "value": 305845,
    "label": "30_ZTT-遮天月"
  },
  {
    "value": 1339,
    "label": "3_LSJ-齿轮"
  }
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
      title: '活跃度',
      dataIndex: 'activityLevel',
    },
    {
      title: '死亡比',
      dataIndex: 'diff',
    },
    {
      title: '战力增长',
      dataIndex: 'diffPower',
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
    form.validateFields(['gid']).then((values) => {
      const { gid } = values;

      const startDate = dayjs('2024-10-03');
      const endDate = dayjs('2024-10-14');

      setInfo({
        gNick: options.find((cur) => cur.value === gid)?.label || '',
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      });

      const diffDay = dayjs(endDate).diff(startDate, 'day');

      const days = Array.from({
        length: diffDay + 1,
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
            activityLevel: diffSumKill + diffDie,
            ...rank,
          };
        };

        const newData = data.map((item) => {
          const rows = item.data;

          if (rows.length) {
            const first =
              rows.find((item) => {
                return `${item.day}` === startDate.format('YYYYMMDD');
              }) || rows[rows.length - 1];
            const last =
              rows.find((item) => {
                return `${item.day}` === endDate.format('YYYYMMDD');
              }) || rows[0];

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
            <Select optionFilterProp="label" showSearch options={options} style={{ width: 200 }} />
          </Form.Item>

          {/*<Form.Item*/}
          {/*  label="日期范围"*/}
          {/*  name="rangeDate"*/}
          {/*  rules={[{ required: true, message: '请选择日期范围' }]}*/}
          {/*>*/}
          {/*  <RangePicker />*/}
          {/*</Form.Item>*/}

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
