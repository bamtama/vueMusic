<template>
<div class="m-media">
	<img class="cover" v-bind:src="item.picUrl" />
	<h4>{{item.name}}</h4>
	
	<!-- 双向绑定以后无法更改值？？
	<mt-range v-model="valueRange" :min="0" :max="end" class="slider">
	  <div slot="start">{{ startTime }}</div>
	  <div slot="end">{{ duration }}</div>
	</mt-range> -->
	<div class="m-range">
		<span>{{ startTime }}</span>
		<input type="range" :min="0" :max="end" :value="valueRange" class="range" v-on:input="isChanging" @change="changeValue">
		<span>{{ duration }}</span>
	</div>
	<div class="options">
		<span class="btn-mode" @click="changePlayMode" v-bind:mode="playMode">模式</span>
		<span class="btn-like">喜欢</span>
		<span class="btn-list" @click="showPlaylist">歌单</span>
	</div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '../api'
import util from '../util'
export default{
	name:'Media',
	data(){
		return{
			id: this.$route.params.id,
			item : {},
			end: 0,
			start: 0,
			isRangeChanging: false,
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
			if(this.isRangeChanging){
				return this.$el.querySelector('.range').value;
			}
			else{
		    	return this.$store.state.playingTime;
			}
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
			this.$store.commit('setNavShow', true)
			this.$store.commit('setNavState', 1)
		},
		getMusic(id){
			api.getSongDetail(id).then(response=>{
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
					this.$store.dispatch('updatePlayList',{item: this.item})
				}
			})
		},
		onEvent(){
			
		},
		isChanging(){
			//this.startChangeStep = this.$el.querySelector('.range').value;
			this.isRangeChanging = true;
		},
		changeValue(){
			this.isRangeChanging = false;
			var val = this.$el.querySelector('.range').value;
			this.$store.dispatch('changePlayingTime',{time:val, flag:true})
		},
		changePlayMode(){
			var m = this.playMode,
				nmode = (++m)%3;
			this.$store.commit('setPlayMode', nmode);
		},
		showPlaylist(){
			this.$store.commit('setPlaylistShow', !this.isPlaylistShow)
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
			console.log(to)
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
	padding: 30px;
	&>.cover{
		width: 100%;
	}
	&>h4{
		font-size: 18px;
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
		.btn-mode{
			&[mode="0"]{
				color: red;
			}
			&[mode="1"]{
				color: blue;
			}
			&[mode="2"]{
				color: green;
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
	&>.range{
		flex: auto;
		margin: 0 15px;
	}
	&>span{
		flex: none;
	}
}
</style>