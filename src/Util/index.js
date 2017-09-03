export default{
	FormatTime(dur){
		var min = parseInt(dur/60),
			sec = parseInt(dur%60);
		var mstr = min>=10 ? `${min}` : `0${min}`,
			sstr = sec>=10 ? `${sec}` : `0${sec}`;
		return `${mstr}:${sstr}`
	}
}