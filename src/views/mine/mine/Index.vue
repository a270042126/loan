<template>
  <base-page tabBarIndex="3">
    <better-scroll>
      <mine-header/>
      <div class="content">
        <mine-tool />
      </div>
    </better-scroll>
  </base-page>
</template>

<script>
import MineHeader from './components/MineHeader'
import MineTool from './components/MineTool'
export default {
  name: 'Mine',
  components: {
    MineHeader,
    MineTool
  }
}
</script>
