import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import api from '../api'

const store = new Vuex.Store({
	state:{
		navShow: false ,
		navState: 1,			//显示的情况下，0-个人主页，1-播放
		navLeftShow: true,		//显示nav左列表
		isPlaying: false,
		isPlaylistShow: false,
		playList: [],
		playMode: 0 ,			//0-顺序，1-单曲循环，2-随机，
		playingTime: 0,			//当前播放时间点,
		isNextOrPrev: false,	//是否正在前后切
		changeFlag:false,		//是否正在拖动播放条
		duration: 0,			//曲长
		currentId: null,		//当前播放歌曲id,
		currentSong: {}			//当前播放歌曲对象
	},
	getters:{
		navShow : state=>state.navShow,
		navState : state => state.navState,
		navLeftShow: state=> state.navLeftShow,
		isPlaylistShow: state=> state.isPlaylistShow,
		isPlaying : state => state.isPlaying,
		playList : state => state.playList,
		playMode : state => state.playMode,
		playingTime : state => state.playingTime,
		isNextOrPrev: state => state.isNextOrPrev,
		changeFlag: state => state.changeFlag,
		duration: state=>state.duration,
		currentId : state => state.currentId,
		currentSong : state => state.currentSong
	},
	mutations:{
		setNavShow:(state,flag)=>{state.navShow = flag},
		setNavState:(state, ns)=>{state.navState = ns},
		setnavLeftShow:(state, flag=true)=> {state.navLeftShow = flag},
		setPlaylistShow:(state, flag)=> {state.isPlaylistShow = flag},
		togglePlaylistShow:(state) =>{ state.isPlaylistShow = !state.isPlaylistShow},
		setIsPlaying:(state, flag)=>{state.isPlaying = flag},
		setPlayMode:(state, mode)=>{state.playMode = mode},
		setPlayingTime:(state, time)=>{
			state.playingTime = time;
		},
		setIsNextOrPrev:(state, flag)=>{
			state.isNextOrPrev = flag;
		},
		setChangeFlag:(state, flag)=>{
			state.changeFlag = flag;
		},
		setCurrentId:(state, id)=>{
			state.currentId = id
		},
		setCurrentSong:(state, item)=>{state.currentSong = item},
		setPlayList:(state, item)=>{
			if(state.playList.length == 0){
				state.playList.push(item);
			}
			else{
				var re = false;
				state.playList.forEach(function(ele,index){
					if(ele.id === item.id){
						re = true; 
					}
				})
				if(!re){
					//无重复，则添加
					state.playList.push(item)
				}
			}
		},
		emptyPlayList:(state)=>{
			state.playList = [];
		},
		setLocalPlayList:(state, list)=>{
			state.playList = list;
		}
	},
	actions:{
		changePlayingTime ({ commit , state}, {time,flag}) {
			commit('setPlayingTime', time);
			commit('setChangeFlag', flag);
		},
		changeCurrentId({commit, state},{item}){
			commit('setCurrentId', item.id);
			commit('setCurrentSong', item);
			commit('setIsNextOrPrev', false);
		},
		initLocalPlayList({commit, state}){
			var list = window.localStorage.getItem('localList'), jsonlist ;
			if(list != '[null]' && list != null){
				list = list;
			}
			else{
				list = '[]';
			}
			jsonlist = JSON.parse(list);
			commit('setLocalPlayList', jsonlist);
			if(jsonlist.length>0){
				commit('setNavShow', true);
			}
			else{
				commit('setNavShow',false);
			}
			//设置当前播放歌曲
			if(!state.isPlaying){
				if(state.currentId == null){
					if(state.playList.length > 0){
						commit('setCurrentSong', state.playList[0])
						commit('setCurrentId', state.currentSong.id)
					}
				}
			}
		},
		updatePlayList({commit, state}, {item , opt = 'add'}){
			//暂时只考虑添加
			if(opt=='add'){
				commit('setPlayList', item);
				//更新本地存储
				window.localStorage.setItem('localList', JSON.stringify(state.playList));
			}
		},
		clearPlaylist({commit, state}){
			var item;
			if(state.currentId != null){
				state.playList.forEach((ele, index)=>{
					if(ele.id == state.currentId){
						item = ele;
					}
				})
				commit('emptyPlayList');
				commit('setPlayList', item);
				window.localStorage.setItem('localList', JSON.stringify(state.playList));
			}
			else{
				commit('emptyPlayList');
				window.localStorage.setItem('localList', JSON.stringify([]));
			}
		}
	}
})

export default store