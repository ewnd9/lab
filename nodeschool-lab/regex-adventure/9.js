module.exports = str => {
	const m = /x=(\d+)/.exec(str);
	return m ? m[1] : null;
};
