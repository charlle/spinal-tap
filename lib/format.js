export default class Format {
	/*
    Method: url
		Param: search query
		Resp: json object
  */
	url(u) {
		if(!u) return;
		let url = u.toString().trim().substring(1).toLowerCase();
				url = decodeURI(url).replace(/['"]+/g, '');
				url = url.replace(/&/g, "\",\"").replace(/=/g,"\":\"");
				url = JSON.parse('{"' + url + '"}');

		return url;
	}
}