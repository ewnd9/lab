module.exports = str => {
	const m = /\bx=(\d+)\b/.exec(str);
	return m ? m[1] : m;
};
