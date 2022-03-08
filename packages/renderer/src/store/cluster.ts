import type { ClusterItem, ClusterState } from 'dst'
import { defineStore } from 'pinia'
import { sshOperate } from '../utils/ssh-operate'

export const useClusterStore = defineStore('cluster', {
  state: (): ClusterState => ({
    list: [], // 存档列表
  }),
  getters: {},
  actions: {
    /**
     * 覆盖本地存档列表
     * @param list 存档列表
     */
    setClusterList(list: ClusterItem[]) {
      this.list = list
    },
    /**
     * 获取服务器上所有的存档
     */
    async getClusterList() {
      const res = await sshOperate.getClusterList() // ['Cluster_1', ...]
      const list = []
      for (const cluster of res) {
        // 获取存档扩展属性
        const { token, adminList } = await sshOperate.getClusterInfo(cluster)
        list.push({
          id: cluster,
          config: await sshOperate.getClusterConfig(cluster), // 存档配置
          token,
          adminList,
          modConfig: await sshOperate.getClusterModConfig(cluster), // 存档模组配置
        })
      }
      this.setClusterList(list)
    },
  },
})
// async patchApplyConfig() {
//   const config = useConfigStore()
//   const res = await sshOperate.serverGetApplyConfig(config.serverExtra.cluster || 1)
//   const applyConfig = JSON.parse(res)
//   this.serverList.forEach((id) => {
//     this._list[id].applyConfig = applyConfig[id]
//   })
// },
// async setModConfig(id: string, applyConfig: ModApplyConfig): Promise<boolean> {
//   this._list[id].applyConfig = applyConfig
//   return await this.applyServerModConfig()
// },
// async setModEnabledStatus(id: string, enabled: boolean): Promise<boolean> {
//   const config = this._list[id]
//   if (!config.applyConfig) {
//     this.setModConfigDefault(id)
//     config.applyConfig = this._list[id].applyConfig
//   }
//   if (config.applyConfig)
//     config.applyConfig.enabled = enabled

//   this._list[id] = config
//   await store.set('mod-list', this._list)
//   return await this.applyServerModConfig()
// },
// setModConfigDefault(id?: string) {
//   let list = []
//   id ? list = [id] : list = this.serverList
//   list.forEach((id) => {
//     const config = this._list[id]
//     if (!config?.applyConfig) {
//       config.applyConfig = {
//         configuration_options: (config.originConfig || []).reduce((acc, item) => {
//           acc[item.name] = item.default
//           return acc
//         }, {} as Record<string, string | boolean| number>),
//         enabled: false,
//       }
//       this._list[id] = config
//     }
//   })
//   store.set('mod-list', this._list)
// },
// async applyServerModConfig(): Promise<boolean> {
//   const config = `return {\n${this.serverList.map((id) => {
//     let applyConfig = this._list[id].applyConfig
//     if (!applyConfig) {
//       this.setModConfigDefault(id)
//       applyConfig = this._list[id].applyConfig
//     }
//     const options = applyConfig?.configuration_options || {}
//     return `\t["workshop-${id}"] = {\n\t\tconfiguration_options = {\n${
//       Object.keys(options).map((key) => {
//         let value = options[key]
//         if (typeof (value) !== 'boolean')
//           value = `"${value}"`
//         const retain = ['and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 'function', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat', 'return', 'then', 'true', 'until', 'while', 'goto']
//         if (key.includes(' ') || retain.includes(key))
//           key = `["${key}"]`
//         return `\t\t\t${key || '[""]'} = ${value}`
//       }).join(',\n')
//     }\n\t\t},\n\t\tenabled = ${
//       applyConfig?.enabled || false
//     }\n\t}`
//   }).join(',\n')}\n}`
//   const configStore = useConfigStore()
//   return await sshOperate.applyServerModConfig(config, configStore.serverExtra.cluster || 1)
// },