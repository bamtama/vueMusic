<template>
	<footer v-show='navShow'>
		<div class="nav">
			<span class="link" v-show='navState==0'>
				<router-link to="/">首页</router-link>
			</span>
			<span class="prevbtn" v-show='navState==1' @click='playNextOrPrev(-1)'>
				<i class="iconfont icon-prev"></i>
			</span>
			<span class="playbtn" v-bind:class='{"z-playing": isPlaying}' @click='playOrNot'>
				<i class="iconfont icon-play"></i>
				<i class="iconfont icon-pause"></i>
			</span>
			<span class="prevbtn" v-show='navState==1' @click='playNextOrPrev(1)'>
				<i class="iconfont icon-next"></i>
			</span>
			<span class="link" v-show='navState==0'>我的</span>
		</div>
		<div class="player">
			<audio :src="audioItem.url" @canplay="getPlayState" @timeupdate="audioTimeUpdate" @ended="playEnd" 
				preload ></audio>
		</div>
		<transition name="fade">
			<div class="m-playlist" v-show='isPlaylistShow'>
				<div class="close" @click='hidePlaylist'>关闭</div>
				<ul>
					<li v-for="item in playList" v-bind:class="{'cur':item.id==currentId}" @click='goPlay(item.id)'>{{item.name}}</li>
				</ul>
			</div>
		</transition>
	</footer>
</template>
<script>
import { mapGetters } from 'vuex'
import api from '../api'
export default{
	name:'PlayerNav',
	data(){
		return {
			id: null,
			audioItem:{}
		}
	}, 
	computed:{
		...mapGetters([
			'navState',
			'navShow',
			'currentId',
			'playingTime',
			'duration',
			'isPlaying',
			'playList',
			'isPlaylistShow',
			'playMode'
		])
	},
	methods:{
		playOrNot(){
			if(!this.$audio.paused){
				this.$store.commit('setIsPlaying', false);
			}
			else{
				this.$store.commit('setIsPlaying', true);
			}
		},
		getDuration(){
			//alert(this.$audio.duration)
			// var end  = this.FormatTime(this.$audio.duration),
			// 	start = this.FormatTime(this.$store.state.playingTime);
			// this.$store.commit('setPlayingTime',{start:start, end:end})
		},
		getPlayState(){
			this.$store.commit('setIsPlaying', true)
		},
		getMusicSource(){
			//获取musicurl
			this.$store.commit('setIsPlaying',false);
			if(this.id == null){
				return
			}
			return api.getMusicUrl(this.id).then(response=>{
				console.log(JSON.stringify(response))
				if(response.data.code == 200){
					this.audioItem = response.data.data[0];
				}
			})
		},
		onEvent(){
		},
		audioTimeUpdate(){
			if(!this.$store.state.changeFlag){
				this.$store.commit('setPlayingTime',this.$audio.currentTime)
			}
			else{
				this.$audio.currentTime = this.$store.state.playingTime;
				this.$store.commit('setChangeFlag', false)
			}
		},
		playEnd(){
			this.playWithList();
		},
		playWithList(){
			var mode = this.$store.state.playMode,
				list = this.$store.state.playList,
				cid = this.$store.state.currentId;
			switch(mode){
				case 0:
					//顺序
					this.playNextOrPrev(1);
					break;
				case 1:
					//单曲循环
					this.$audio.currentTime = 0;
					this.audioTimeUpdate();
					this.$audio.play();	
					//this.$store.commit('setIsPlaying', true);	//未触发watch事件？
					break;
				case 2:
					//随机
					//简单随机
					var index = Math.floor(list.length*Math.random());
					this.$store.commit('setCurrentId', list[index].id);
					break;
			}
		},
		playNextOrPrev(arrow){
			var list = this.$store.state.playList,
				cid = this.$store.state.currentId,
				nid, ni =-1;
			list.forEach((ele, index)=>{
				if(ele.id == cid){
					if(arrow === -1){
						ni = (--index)%list.length;
					}
					else if(arrow == 1){
						ni = (++index)%list.length;
					}
					return ;
				}
			})
			nid = list[ni].id;
			//设定当前播放id
			this.$store.commit('setCurrentId', nid);
		},
		hidePlaylist(){
			this.$store.commit('setPlaylistShow', false)
		},
		goPlay(id){
			//this.$router.replace({name:'Media',params:{id: id}})
			this.$store.commit('setCurrentId', id)
		}
	},
	watch:{
		currentId(val, oldval){
			if(val != oldval){
				this.id = val;
				this.getMusicSource();
			}
		},
		changeFlag(val, oldval){
			console.log(this.playingTime)
		},
		isPlaying(val, oldval){
			if(val){
				console.log('why not play')
				this.$audio.play()
			}
			else{
				this.$audio.pause();
			}
		}
	},
	mounted(){
		this.$audio = document.querySelector('.player audio');
		this.getMusicSource();
		this.onEvent();
	}
}
</script>
<style lang='less' scoped>
.nav{
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	&>span{
		line-height: 48px;
		flex: 1 1 auto;
		text-align: center;
		.iconfont{
			font-size: 24px;
		}
		&.playbtn{
			.iconfont{
				font-size: 32px;
			}
			.icon-play{
				display: block;
			}
			.icon-pause{
				display: none;
			}
			&.z-playing{
				.icon-play{
					display: none;
				}
				.icon-pause{
					display: block;
				}
			}
		}
	}
}
footer{
	position: relative;
}
.m-playlist{
	position: absolute;
	bottom: 48px;
	left: 0;
	width: 100%;
	background: rgba(155,155,155,0.9);
	&>.close{
		text-align: right;
		padding-right: 2em;
		background: rgba(0,0,0,0.35);
		line-height: 36px;
	}
	&>ul{
		max-height: 360px;
		overflow: auto;
		&>li{
			height: 36px;
			line-height: 36px;
			padding: 0 2em;
			&.cur{
				color: red;
			}
		}
	}
}
.fade-enter-active, .fade-leave-active {
  transition:opacity .5s;
}
.fade-enter, .fade-leave-to{
  opacity:0;
}
</style>