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
				<div class="opts">
					<span @click='clearPlaylist'>清空列表</span>
					<span @click='hidePlaylist'>关闭</span>
				</div>
				<ul>
					<li v-for="item in playList" v-bind:class="{'cur':item.id==currentId}" @click='goPlay(item.id)'>{{item.name}}</li>
				</ul>
			</div>
		</transition>
		<div class="mask" v-show='isPlaylistShow' @click='hidePlaylist'></div>
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
				//开发
				console.log(JSON.stringify(response))
				if(response.data.code == 200){
					this.audioItem = response.data.data[0];
				}

				//build 本地json
				// if(response.data[this.id]){
				// 	this.audioItem = response.data[this.id].data[0];
				// }
				// else{
				// 	alert('无源')
				// }
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
			if(this.$store.state.isNextOrPrev){
				return;
			}
			this.$store.commit('setIsNextOrPrev', true);
			var list = this.$store.state.playList,
				cid = this.$store.state.currentId,
				nid, ni =-1;
			list.forEach((ele, index)=>{
				if(ele.id == cid){
					if(arrow === -1){
						if(index==0){
							ni = (list.length-index-1)%list.length;
						}
						else{
							ni = (--index)%list.length;
						}
					}
					else if(arrow == 1){
						ni = (++index)%list.length;
					}
					return ;
				}
			})
			nid = list[ni].id;
			//设定当前播放id
			// this.$store.commit('setCurrentId', nid);
			this.$store.dispatch('changeCurrentId',{id:nid})
		},
		hidePlaylist(){
			this.$store.commit('setPlaylistShow', false)
		},
		clearPlaylist(){
			//清空列表
			alert('to do sth')
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
	padding: 10px 0 0 0;
	align-items: center;
	&>span{
		flex: 1 1 auto;
		text-align: center;
		.iconfont{
			font-size: 48px;
		}
		&.playbtn{
			.iconfont{
				font-size: 64px;
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
.mask{
	background: rgba(0,0,0,0.5);
	height: 100vh;
	width: 100vw;
	position: absolute;
	left: 0;
	bottom: 88px;
	z-index: 1;
}
.m-playlist{
	position: absolute;
	bottom: 88px;
	left: 0;
	width: 100%;
	background: rgba(0,0,0,0.7);
	z-index: 99;
	&>.opts{
		text-align: right;
		padding-right: 20px;
		background: rgba(0,0,0,0.6);
		line-height: 72px;
		&>span{
			margin: 0 20px;
		}
	}
	&>ul{
		max-height: 50vh;
		overflow: auto;
		&>li{
			font-size: 32px;
			height: 64px;
			line-height: 64px;
			padding: 0 40px;
			&.cur{
				background: rgba(255,255,255,0.1);
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