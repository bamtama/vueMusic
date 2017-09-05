<template>
<div class="m-playlist">
	<div class="info">
		<img :src="playList.coverImgUrl">
		<div class="cont">
			<h5>{{ playList.name }}</h5>
		</div>
	</div>
	<!-- <div class="list">
		<mt-cell v-for="track in playList.tracks">
			<router-link :to="{name:'Media',params:{id:track.id}}">{{track.name}}</router-link>
		  	<mt-button size="small" @click.stop='updatePlaylist(track.id)'>play</mt-button>
		</mt-cell>
	</div> -->
	<div class="list-wrap">
		<p>歌曲列表</p>
		<ul class="list">
			<li v-for="track in playList.tracks">
				<router-link :to="{name:'Media',params:{id:track.id}}">{{track.name}}</router-link>
			  	<i class="iconfont icon-play" @click.stop='updatePlaylist(track)'>
			  	</i>
			</li>
		</ul>
	</div>
</div>
</template>
<script>
import api from '../api'
export default{
	name:'playlist',
	data(){
		return{
			id: this.$route.query.id,
			playList:{}
		}
	},
	methods:{
		getPlayList(){
			api.getPlaylistDetail(this.id).then(response=>{
				//dev
				if(response.data.code===200){
					this.playList = response.data.playlist;
				}

				//build  json
				// this.playList = response.data[this.id].playlist;
			})
		},
		updatePlaylist(item){
			this.$store.commit('setCurrentId',  item.id);
			this.$store.dispatch('updatePlayList',{item: {
				'name': item.name,
				'id': item.id,
				'dt': item.dt/1000,
				'picUrl': item.al.picUrl
			}})
			//显示播放条
			this.$store.commit('setNavShow', true)
			this.$store.commit('setNavState', 1)
		}
	},
	computed:{
	},
	mounted(){
		this.getPlayList()
	}
}
</script>
<style lang='less' scroped>
.m-playlist{
	height: auto;
	.info{
		text-align: left;
		border-bottom: 1px solid #ddd;
		img{
			width: 200px;
			margin: 20px;
		}
		.cont{
			display: inline-block;
			width: 400px;
			vertical-align: top;
			margin: 20px;
			h5{
				font-size: 36px;
			}
		}
	}
	.list-wrap{
		&>p{
			padding: 10px 0;
			line-height: 48px;
		}
	}
	.list{
		&>li{
			height: 72px;
			margin: 0 20px;
			text-align: left;
			display: flex;
			flex-direction: row;
			align-items: center;
			border-top: 1px solid #eee;
			&>a{
				font-size: 32px;
				display: inline-block;
				vertical-align: middle;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				flex: auto;
			}
			&>.iconfont{
				flex:none;
				font-size: 36px;
				color: darkgray;
			}
		}
	}
}
</style>