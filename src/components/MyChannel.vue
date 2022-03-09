<template>
  <div>
    <el-select
    @change="changeChannel"
    :value="value"
    placeholder="请选择"
    clearable
  >
    <el-option
      v-for="item in channelOptions"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    >
    </el-option>
  </el-select>
  </div>
</template>

<script>
export default {
  name: 'MyChannel',
  props: ['value'],
  data () {
    return {
      channelId: null,
      channelOptions: []
    }
  },
  created () {
    this.getChannelOptions()
  },
  methods: {
    changeChannel (changedChannelId) {
      // 通知父组件，频道ID已变化，你也需要改变
      this.$emit('input', changedChannelId)
    },
    async getChannelOptions () {
      const res = await this.$http.get('/v1_0/channels')
      this.channelOptions = res.data.data.channels
    }
  }
}
</script>

<style lang="less" scoped>

</style>
