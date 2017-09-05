<template>
  <div id="app">
  	<center>
    	<router-view></router-view>
  	</center>
    <player-nav></player-nav>
  </div>
</template>
<script>
export default {
  name: 'app',
  created(){
  	this.$store.dispatch('initLocalPlayList');
  }
}
</script>
<style lang='less'>
html,body{
	height: 100%;
}
#app{
	display:flex;
	flex-direction: column;
	height: 100%;
	center{
		flex: 1;
		overflow: auto;
	}
	footer{
		flex: 0 0 auto;
		height: 88px;
		background: rgba(0,0,0,0.9);
		color: white;
	}
}
</style>