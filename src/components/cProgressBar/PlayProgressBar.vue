<template>
	<div class="m-progress-bar">
		<div class="twrap">
			<slot name="tStart"></slot>
		</div>
		<div class="bar" v-bind:data-min='min' v-bind:data-max='max' v-bind:data-per='rangePercent' ref='bar'>
			<div class="cur" v-bind:style='{width:rangePercent}'>
				<span ref='cur' class="ico-cur"></span>
			</div>
		</div>
		<div class="twrap">
			<slot name="tEnd"></slot>
		</div>
	</div>
</template>
<script>
import drag from './drag.js'
export default{
	data(){
		return{
			test: false
		}
	},
	props:{
		min:{
			type:Number,
			default: 0
		},
		max:{
			type:Number,
			default: 100
		},
		rangeValue:{
			default:0
		},
		value:{
			default:0
		}
	},
	computed:{
		rangePercent(){
			return (this.value/this.max*100)+'%'
		}
	},
	watch:{
	},
	methods:{
	},
	mounted(){
		const $cur = this.$refs.cur;
		const $bar = this.$refs.bar;

		const getCurPosition = ()=>{
			const curBox = $cur.getBoundingClientRect(),
				  barBox = $bar.getBoundingClientRect();
			return {
				left : curBox.left - barBox.left,
				top : curBox.top - barBox.top
			}
		}
		let dragStart = {};
		drag($cur, {
			start:(ev)=>{
				dragStart = {
					mouseX: ev.clientX,
					curX : $cur.getBoundingClientRect().left - $bar.getBoundingClientRect().left
				}
			},
			end:(ev)=>{
				dragStart = {};
			},
			move:(ev)=>{
				const barWidth = $bar.clientWidth;
				let offsetX = ev.clientX - dragStart.mouseX + dragStart.curX;
				let offsetPercent = offsetX / barWidth * 100;
				if(offsetPercent >= 100){
					offsetPercent = 100;
				}
				else if(offsetPercent <= 0){
					offsetPercent = 0;
				}
				else{
				}
				$cur.parentNode.style = 'width: '+ offsetPercent +'%'
				this.$emit('changeValue', Math.ceil(offsetPercent * this.max / 100))
			}
		})
	}
}	
</script>
<style lang='less' scoped>
.m-progress-bar{
	width: 100%;
	padding: 20px 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	.twrap{
		flex:none;
	}
	.bar{
		flex:auto;
		margin: 0 30px;
		height: 6px;
		background: lightgray;
		position: relative;
		.cur{
			height: 6px;
			background: gray;
			position: absolute;
			left: 0;
			top: 0;
			.ico-cur{
				display: block;
				width: 16px;
				height: 32px;
				background: black;
				position: absolute;
				right: 0;
				top: -13px;
			}
		}
	}
}
</style>