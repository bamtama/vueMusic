import axios from 'axios'
// Vue.prototype.$http = axios.create({
// 	baseURL: '/muzapi'
// })
axios.defaults.baseURL = '/muzapi'

//api为官方api，开发环境转发跨域，查询参考此项目https://github.com/Binaryify/NeteaseCloudMusicApi

const PersonalizedPlaylist = '/personalized/playlist';	//热门推荐歌单
const PlaylistDetail = '/v3/playlist/detail';					//歌单详情
const SongDetail = '/v3/song/detail';							//歌曲详情
const MusicUrl = '/song/enhance/player/url';			//mp3url

export default{
	getPersonalizedPlaylist(){
		return axios.get(PersonalizedPlaylist)
	},
	getPlaylistDetail(id){
		return axios.get(PlaylistDetail, { params: { 
			id : id
		}})
	},
	getSongDetail(id){
		return axios.get(SongDetail, {params:{
			c: JSON.stringify([{ id: id }]),
		    ids: `[${id}]`,
		    csrf_token: ''
		}})
	},
	getMusicUrl(id){
		return axios.get(MusicUrl, {params:{
			ids:`[${id}]`,
    		br: 999000,
    		csrf_token: ''
		}})
	}
}