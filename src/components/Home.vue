<template>
<div>some strange page</div>
</template>

<script>
export default{
	name:'home',
	data(){
		return{

		}
	},
	methods:{
		initNav(){
			this.$store.commit('setNavShow', true),
			this.$store.commit('setNavState', 0)
		}
	},
	mounted(){
		this.initNav();
	}
}
</script>
<style scoped lang='less'>
	
</style>