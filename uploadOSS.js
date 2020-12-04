const OSS = require('ali-oss')

// 公司
// const client = OSS({
//     accessKeyId: 'w122A7d2d2NIV7Pf',
//     accessKeySecret: 'PO5EIECFaVC4KOWbwyPa7TvZULTPAl',
//     bucket: 'wemark',
//     region: 'oss-cn-shenzhen',
//     timeout: 3000000
// })

// 个人
const client = OSS({
    accessKeyId: 'I24bUrWouhPLOpLj',
    accessKeySecret: 'LeC3muidG0Q64UGGEorxwjjuyNYO53',
    bucket: 'us-release-exe',
    region: 'oss-us-west-1',
    timeout: 300000
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

// putOSS('./release/红旗直播-1.2.0.pkg', 'release/红旗直播-1.2.0.pkg')

// putOSS('./package.json', 'release/package.json')

const progress = (p, _checkpoint) => {
    console.log(p); // Object的上传进度。
    console.log(_checkpoint); // 分片上传的断点信息。
};

// 开始分片上传。
async function multipartUpload() {
    try {
        // object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
        const result = await client.multipartUpload('release/红旗直播-1.2.0.pkg', './release/红旗直播-1.2.0.pkg', {
            progress,
            // meta是用户自定义的元数据，通过head接口可以获取到Object的meta数据。
            meta: {
                year: 2020,
                people: 'test',
            },
        });
        console.log(result);
        const head = await client.head('release/红旗直播-1.2.0.pkg');
        console.log(head);
    } catch (e) {
        // 捕获超时异常。
        if (e.code === 'ConnectionTimeoutError') {
            console.log('TimeoutError');
            // do ConnectionTimeoutError operation
        }
        console.log(e);
    }
}

multipartUpload();