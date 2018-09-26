
let utfString = (x) => Number(Math.floor((parseInt(x, 16) - 65536) / 1024) + 55296).toString(16) + ' ' + Number(Math.floor((parseInt(x, 16) - 65536) % 1024) + 56320).toString(16)
