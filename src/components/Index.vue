<template>
	<div class="m-index">
		<mt-search v-model="value"></mt-search>
		<div class="index-swipe">
			<mt-swipe :auto="0">
		      <mt-swipe-item v-for="imgsrc in imgs">
		      	<img v-bind:src="imgsrc" />
		      </mt-swipe-item>
		    </mt-swipe>
		</div>
		<div class="m-grid">
			<h4>推荐歌单</h4>
			<ul class="grid-ul">
				<li v-for="m in medias" @click="goPlayList(m.id)">
					<img v-bind:src="m.picUrl" />
					<span>{{ m.name }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import api from '../api'

export default {
  name: 'Index',
  data () {
    return {
      value:'',
      imgs: ['http://wx1.sinaimg.cn/mw690/006fcAFqgy1fj3auw1ej2j31hc0s9tt0.jpg',
      'http://wx3.sinaimg.cn/mw690/006fcAFqgy1fj3aumri94j31gf0ti4j9.jpg',
      'http://wx2.sinaimg.cn/mw690/006fcAFqgy1fj3av3os0vj31ev0sadza.jpg'],
      medias:[]
    }
  },
  methods:{
  	goPlayList(id){
  		// this.medias.forEach((ele, index)=>{
  		// 	if(ele.id === id){
  		// 		this.$store.commit('setPlayList', ele);
  		// 		return;
  		// 	}
  		// })
  		this.$router.push({'path':`/PlayList?id=${id}`})
  	},
  	initNav(){
  		this.$store.commit('setNavShow', false)
  	},
  	getMusics(){
  		// this.$http.get('/personalized/playlist').then(response=>{
  		// 	if(response.data.code === 200){
  		// 		this.medias = response.data.result;
  		// 	}
  		// }, response=>{
  		// 	console.log('error')
  		// })
  		api.getPersonalizedPlaylist().then(response=>{
  			if(response.data.code === 200){
  				this.medias = response.data.result;
  			}
  		}, response=>{
  			console.log('error')
  		})
  	}
  },
  create(){
  	this.initNav();
  },
  mounted(){
  	this.getMusics();
  }
}
</script>

<style lang='less' scoped>
	.mint-search{
		height: auto;
	}
	.index-swipe{
		height: 170px;	/*?mt-swipe原样式不能自适应内部宽高*/
	}
	img{
		width:100%;
	}
	.m-grid{
		padding: 0 2vw;
		&>h4{
			font-size: 18px;
			padding-left: 2vw;
			text-align: left;
		}
		&>.grid-ul{
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			&>li{
				width: 31vw;
				padding: 1vw;
			}
		}
	}
</style>