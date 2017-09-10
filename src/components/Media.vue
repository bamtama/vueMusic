<template>
<div class="m-media">
	<div class="cover-wrap">
		<img class="cover" v-bind:src="item.picUrl" />
	</div>
	<h4>{{item.name}}</h4>
	<!-- 双向绑定以后无法更改值？？
	<mt-range v-model="valueRange" :min="0" :max="end" class="slider">
	  <div slot="start">{{ startTime }}</div>
	  <div slot="end">{{ duration }}</div>
	</mt-range> -->
	<!-- <div class="m-range">
		<span>{{ startTime }}</span>
		<input type="range" :min="0" :max="end" :value="valueRange" class="range" v-on:input="isChanging" @change="changeValue">
		<span>{{ duration }}</span>
	</div> -->
	<my-progress-bar :min='0' :max='end' v-model='valueRange' v-on:changeValue='changeValue'>
		<span slot='tStart'>{{ startTime }}</span>
		<span slot='tEnd'>{{ duration }}</span>
	</my-progress-bar>
	<div class="options">
		<span class="btn-mode" @click="changePlayMode" v-bind:mode="playMode">
			<i class="iconfont icon-loop" v-show='playMode==0'></i>
			<i class="iconfont icon-singleloop" v-show='playMode==1'></i>
			<i class="iconfont icon-random" v-show='playMode==2'></i>
		</span>
		<span class="btn-like iconfont icon-like" @click='addFav' v-bind:class='{"z-like":favFlag}'></span>
		<span class="btn-list iconfont icon-playlist" @click="showPlaylist"></span>
	</div>
</div>
</template>

<script>
import PlayProgressBar from './cProgressBar/PlayProgressBar.vue'
import { mapGetters } from 'vuex'
import api from '../api'
import util from '../util'
export default{
	name:'Media',
	components:{
		'my-progress-bar':PlayProgressBar
	},
	data(){
		return{
			id: this.$route.params.id,
			item : {},
			end: 0,
			start: 0,
			favFlag : false
			//startChangeStep: -1
		}
	},
	computed:{
		duration:{
			get(){
				return util.FormatTime(this.end)
			},
			set(val){
				this.end = val;
			}
		},
		startTime(){
			return util.FormatTime(this.$store.state.playingTime)
		},
		valueRange() {
			return this.$store.state.playingTime;
		},
		...mapGetters([
			'playingTime',
			'playMode',
			'isPlaylistShow',
			'currentId'
		])
	},
	methods:{
		initNav(){
			// this.$store.commit('setNavShow', true)
			// this.$store.commit('setNavState', 1)
			this.$store.commit('setnavLeftShow', false)
		},
		getMusic(id){
			api.getSongDetail(id).then(response=>{
				//开发
				if(response.data.code == 200){
					this.item = {
						'name': response.data.songs[0].name,
						'id': response.data.songs[0].id,
						'dt': response.data.songs[0].dt/1000,
						'picUrl': response.data.songs[0].al.picUrl
					}
					this.end = this.item.dt;
					//写入当前播放id
					this.$store.commit('setCurrentId', id);
					this.$store.commit('setCurrentSong', this.item);
					this.$store.dispatch('updatePlayList',{item: this.item})
				}

				//build 本地json
				// if(response.data[id]){
				// 	var song = response.data[id].songs[0];

				// 	this.item = {
				// 		'name': song.name,
				// 		'id': song.id,
				// 		'dt': song.dt/1000,
				// 		'picUrl': song.al.picUrl
				// 	}
				// 	this.end = this.item.dt;
				// 	//写入当前播放id
				// 	this.$store.commit('setCurrentId', id);
				// 	this.$store.dispatch('updatePlayList',{item: this.item})
				// }
				// else{
				// 	alert('无源')
				// }
			})
		},
		onEvent(){
			
		},
		changeValue(newval){
			//var val = this.$el.querySelector('.range').value;
			this.$store.dispatch('changePlayingTime',{time:newval, flag:true})
		},
		changePlayMode(){
			let m = this.playMode,
				nmode = (++m)%3;
			this.$store.commit('setPlayMode', nmode);
		},
		showPlaylist(){
			this.$store.commit('setPlaylistShow', !this.isPlaylistShow)
		},
		addFav(){
			this.favFlag = !this.favFlag;
		}
	},
	watch:{
		currentId(val, oldval){
			if(val != oldval){
				this.$router.replace({name:'Media',params:{id: val}})
				this.getMusic(val);
			}
		},
		$route(to,from){
		}
	},
	mounted(){
		this.initNav();
		this.getMusic(this.id);
		this.onEvent();
	}
}
</script>

<style lang='less' scoped>
.m-media{
	padding: 20px;
	&>.cover-wrap{
		margin: 20px 0;
		position: relative;
		width: 680px;
		height: 680px;
		overflow: hidden;
		border-radius: 50%;
		box-shadow: 0 0 30px rgba(0,0,0,0.2);
		&>.cover{
			position: absolute;
			width: 100%;
			left: 0;
			top: -50%;
			margin-top: 50%;
		}
	}
	&>h4{
		font-size: 48px;
		margin: 10px 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	&>.slider{
		margin: 0 0 10px 0;
		div{
			padding: 0 10px;
		}
	}
	&>.options{
		margin: 20px 0;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		.iconfont{
			font-size: 48px;
		}
		.btn-mode{
			&[mode="0"]{
			}
			&[mode="1"]{
			}
			&[mode="2"]{
			}
		}
		.btn-like{
			&.z-like{
				color: red;
			}
		}
		.btn-list{

		}
	}
}
.m-range{
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 20px 0;
	&>.range{
		flex: auto;
		margin: 0 15px;
	}
	&>span{
		flex: none;
	}
}
</style>