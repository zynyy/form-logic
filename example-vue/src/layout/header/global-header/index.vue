<template>
  <Row
    justify="space-between"
    align="middle"
    :style="{
      height: '100%',
    }"
  >
    <Col span="24">
      <Button @click="handleClick">退出登录</Button>
    </Col>
  </Row>
</template>

<script lang="ts" setup>
import { Row, Col, Button } from "ant-design-vue";

const handleClick = () => {};
</script>
