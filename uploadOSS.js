const OSS = require('ali-oss')

const client = OSS({
    accessKeyId: 'w122A7d2d2NIV7Pf',
    accessKeySecret: 'PO5EIECFaVC4KOWbwyPa7TvZULTPAl',
    bucket: 'wemark',
    region: 'oss-cn-shenzhen'
})

/**
 * 上传文件到OSS
 * @param {*} src
 * @param {*} dist
 */
async function putOSS(src, dist) {
    try {
        //object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
        await client.put(dist, src);
        console.log('上传OSS成功', src, dist);
    } catch (e) {
        console.log(`失败，本地${src} -> 远程${dist}`)
        console.log(e);
    }
}

putOSS('./release/红旗直播-1.2.0.pkg', 'release/红旗直播-1.2.0.pkg')