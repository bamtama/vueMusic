<template>
<div class="m-playlist">
	<div class="info">
		<img :src="playList.coverImgUrl">
		<span>{{ playList.name }}</span>
	</div>
	<!-- <div class="list">
		<mt-cell v-for="track in playList.tracks">
			<router-link :to="{name:'Media',params:{id:track.id}}">{{track.name}}</router-link>
		  	<mt-button size="small" @click.stop='updatePlaylist(track.id)'>play</mt-button>
		</mt-cell>
	</div> -->
	<ul class="list">
		<li v-for="track in playList.tracks">
			<router-link :to="{name:'Media',params:{id:track.id}}">{{track.name}}</router-link>
		  	<mt-button size="small" @click.stop='updatePlaylist(track)'>play</mt-button>
		</li>
	</ul>
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
				if(response.data.code===200){
					this.playList = response.data.playlist;
				}
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
		img{
			width:25vw;
			padding: 10px;
			vertical-align: middle;
		}
		span{
			display: inline-block;
			width: 60vw;
			vertical-align: middle;
			white-space: normal;
			font-size: 18px;
		}
	}
	.list{
		&>li{
			height: 48px;
			padding: 0 10px;
			text-align: left;
			display: flex;
			flex-direction: row;
			&>a{
				display: inline-block;
				line-height: 33px;
				vertical-align: middle;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				flex: auto;
			}
			&>.button{
				flex:none;
			}
		}
	}
}
</style>