let isDragging = false;

const dragFun =(ele, options)=>{

	ele.addEventListener('touchstart', (ev)=>{
		if (isDragging) {
			return false;
		}
		options.start(event.changedTouches[0] || event.touches[0]);
		isDragging = true;
	});
	ele.addEventListener('touchmove', (ev)=>{
		options.move(event.changedTouches[0] || event.touches[0])
	});
	ele.addEventListener('touchend', (ev)=>{
		options.end(event.changedTouches[0] || event.touches[0])
		isDragging = false;
	});
}

export default dragFun;