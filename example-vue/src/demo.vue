<template>
  <div>
    <ul>
      <li v-for="item in data">
        <template v-if="item.type === 'input'">
          <Input :item="item" v-model="model[item.code]" />
        </template>
        <template v-if="item.type === 'select'">
          <Select :item="item" v-model="model[item.code]"/>
        </template>
        <template v-if="item.type === 'radio'">
          <Radio :item="item" v-model="model[item.code]"/>
        </template>
      </li>
    </ul>

    <pagination>
      <button @click="nextClick"></button>
    </pagination>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const model = ref();
interface ConInfo {
  title: string;
  code: string;
  content?: Array<string>;
  nameList: Array<any>;
  type: "radio" | "select" | "input";
  options?: Array<{ code: string; name: string }>;
}

interface InfoList {
  code: "leader" | "personnel";
  name: string;
  conInfo: ConInfo[];
}

const infoList = ref<InfoList[]>([
  {
    code: "leader",
    name: "领导班子",
    conInfo: [
      {
        code:"1",
        title: "一、政治素质40分 （政治信仰、政治领导、政治能力、政治生态）",
        content: [
          "认真学习贯彻习近平新时代中国特色社会主义思想，深入学习党的二十大精神，深刻领悟“两个确立”的决定性意义，增强“四个意识”，坚定“四个自信”，坚决做到“两个维护”。结合实际做好中央重大决策部署的落地接应。",
          "认真落实党建责任制，主动将党建工作深度融入中心，发挥党建引领作用；落实一岗双责，加强对分管领域的党风廉政建设和廉洁风险防控，以及意识形态工作。",
        ],
        type: "input",
        nameList: [],
      },
      {
        code:"2",
        title: "二、团结协作30分（发扬民主、整体合力）",
        content: [
          "严肃党内政治生活，坚持民主集中制，开展批评与自我批评，发挥班子合力。",
          "对待公司的决策部署，不折不扣地贯彻执行，不推诿，不扯皮。",
        ],
        type: "input",
        nameList: [],
      },
      {
        code:"3",
        title: "三、作风形象30分（诚信务实、联系群众、廉洁自律）",
        content: [
          "不断改进工作作风，力戒形式主义、官僚主义，为基层减负；坚持以人民为中心的发展理念，以客户为中心，为员工解难题。",
          "严格遵守党纪党规和企业规章制度，落实中央八项规定精神，诚实守信、廉洁自律、坚持准则。",
        ],
        type: "input",
        nameList: [],
      },
    ],
  },
  {
    code: "personnel",
    name: "领导人员",
    conInfo: [

      {
        code:"4",
        title: "一、党忠诚 20分（坚定理想信念、坚持党的领导、坚决贯彻决策）",
        content: [
          "讲政治，带头学习宣传贯彻党的二十大精神，主动宣贯党的理论、政策，积极参加民主生活会、组织生活会、支部“三会一课”。善于通过做思想政治工作推动管理工作开展。",
          "主动提高政治“三力”，落实意识形态工作，自觉从大局看问题，坚持“国之大者”，把工作放在大局中去思考、定位。",
          "贯彻上级决策积极主动，行动迅速；推动党建工作与生产经营工作深度融合。",
        ],
        type: "input",
        nameList: [],
      },
      {
        code:"5",
        title: "二、勇于创新 20分（持续学习、客户导向、变革创新）",
        content: [
          "主动学习，有管理智慧；直面自身缺点，敢于自我突破；倡导建立学习型组织。",
          "有主动服务的意识、有支撑一线的具体措施；乐于倾听各种不同的见解。",
          "主动寻找创新方法来改进工作，工作点子多、思路广、可操作，抓工作不搞形式主义，注重实效。",
        ],
        type: "input",
        nameList: [],
      },
      {
        code:"6",
        title: "三、治企有方 20分（团队凝聚、开放合作、深入调研）",

        content: [
          "带队伍能力强，敢于管人管事，做事相对公平，尊重员工，关爱下属。心态阳光，容错纠错，调动团队和个人的主观能动性。",
          "与上级、其他部门及下属积极沟通，拓展外部合作，部门间主动配合，出谋划策。",
          "实事求是，深入市、县公司调研，及时妥善解决基层实际困难与问题。",
        ],
        type: "input",
        nameList: [],
      },
      {
        code:"7",
        title: "四、兴企有为 20分（战略承接、狠抓落实、担当敢为）",

        content: [
          "能结合省市实际解读“战略”把握方向，会规划“战术”善决策。有全局意识，兼顾多部门需求和利益。",
          "有组织实施能力，精通业务，推动落地执行。有科学严格的管理手段。",
          "做事果断有担当，善于放权和授权，以身作则。出现工作失误，不向上推责任，不向下推过错，带头寻求解决问题方法。",
        ],
        type: "input",
        nameList: [],
      },
      {
        code:"8",
        title: "五、清正廉洁 20分（遵规守纪、作风优良、诚实守信）",
        content: [
          "严以律己，履行党风廉政建设主体责任，作表率。",
          "心胸宽广，果断、勇敢，处理问题及时。作风正派，有牺牲精神。",
          "履行所做出的承诺，言而有信。做事求真，崇尚实干。",
        ],
        type: "input",
        nameList: [],
      },
      {
        code:"9",
        title: "六、负面事项",
        type: "radio",
        options: [
          {
            code: "A",
            name: "1.是否存在对基层提出问题不管不问不解决的情况；",
          },
          {
            code: "A",
            name: "2.是否存在敷衍塞责、慵懒散拖的情况；",
          },
          {
            code: "A",
            name: "3.是否存在表态多调门高，行动少落实差的情况；",
          },
          {
            code: "A",
            name: "4.是否存在推诿扯皮、只管门前雪的情况；",
          },
          {
            code: "A",
            name: "5.是否存在作风形象不佳，群众意见大的情况。",
          },
        ],
        nameList: [],
      },
    ],
  },
]);

const data = ref<ConInfo[]>(infoList.value[0].conInfo);

const nextClick = () => {
  data.value = infoList.value[1].conInfo;
};


</script>
