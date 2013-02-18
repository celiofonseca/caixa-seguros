
AICCDefault = {};
AICCDefault.DefaultSect = '__params__';
AICCDefault.DefaultOpt = '__value__';
AICCDefault._section = /^\[(.+)\]/;
AICCDefault._option = /^([^ \t]+)[ \t]*=[ \t]*(.*)$/;
AICCDefault._aiccstart = /^aicc_data[ \t]*=[ \t]*(.*)$/;
AICCExclusions = {};

var _exclusions = ["student_id","student_name","credit","output_file","lesson_mode","path","[core_vendor]","[evaluation]","[student_data]"];

for (var e=0;e<_exclusions.length;e++) {
	AICCExclusions[_exclusions[e]] = 1;
}

AICCMinSpec= {};

var _minspec = ["[core]","lesson_location","lesson_status","score","time"];

for (var m=0;m<_minspec.length;m++) {
	AICCMinSpec[_minspec[m]] = 1;
}
		
function AICC(aiccdata) {
	
	var lines = aiccdata.split('\r\n');
	
	var sect = AICCDefault.DefaultSect;
	this[sect] = {};
	var opt = null;
	
	for (var i=0;i<lines.length;i++) {
		var line = lines[i];
		if (line == '') {
			opt = null;
			continue;
		}
		
		var lowerline = line.toLowerCase();
		
		var aiccstart = AICCDefault._aiccstart.exec(lowerline);
		if (aiccstart && aiccstart.length > 0) {
			line = aiccstart[1];
		}
		
		var sectmatch = AICCDefault._section.exec(line);
		if (sectmatch && sectmatch.length > 0) {
			sect = sectmatch[1].toLowerCase();
			if (!this[sect]) {
				this[sect] = {};
			}
			opt = null;
			continue;
		}
		
		var optmatch = AICCDefault._option.exec(line);
		if (optmatch && optmatch.length > 0) {
			opt = optmatch[1].toLowerCase();
			val = optmatch[2];
			this[sect][opt] = val;
			continue;
		}
		
		if (!this[sect][AICCDefault.DefaultOpt]) {
			this[sect][AICCDefault.DefaultOpt] = line;
		} else {
			this[sect][AICCDefault.DefaultOpt] += '\r\n'+line;
		}
		opt = null;
	}
	
	
}

AICC.prototype.toString = function() {

	var out = '';

	for (var section in this) {
		if (typeof(this[section]) == 'function') { continue; }
		if (AICCExclusions['[' + section + ']'] == 1) { continue; }
		
		if (section != AICCDefault.DefaultSect) {

			var wroteHeader = false;
			
			var data = this[section];			

			for (name in data) {
				if (AICCExclusions[name] == 1 || typeof(data[name]) == 'function') { continue; }
				
				if (!wroteHeader) {
					out += '[' + section + ']\r\n';
					wroteHeader = true;
				}
				
				var value = data[name];
				if (name == AICCDefault.DefaultOpt) {
					out += value + '\r\n';
				} else {
					out += name + "=" + value + "\r\n";
				}
			}
			
		}
		
	}
	
	return out;
	
}

AICC.prototype.toMinSpec = function() {

	var out = '';

	for (var section in this) {
		if (typeof(this[section]) == 'function') { continue; }	
		if (AICCMinSpec['[' + section + ']'] != 1) { continue; }
		
		if (section != AICCDefault.DefaultSect) {

			var wroteHeader = false;
			
			var data = this[section];			

			for (name in data) {
				if (AICCExclusions[name] == 1 || typeof(data[name]) == 'function') { continue; }
				
				if (!wroteHeader) {
					out += '[' + section + ']\r\n';
					wroteHeader = true;
				}
				
				var value = data[name];
				if (name == AICCDefault.DefaultOpt) {
					out += value + '\r\n';
				} else {
					out += name + "=" + value + "\r\n";
				}
			}
			
		}
		
	}
	
	return out;
	
}