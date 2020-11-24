const fs = require('fs');
const globalPath = require('path');

const ENV_DEVELOPMENT = 'development';
const ENV_TEST = 'test';
const ENV_PRODUCTION = 'production';

const projectId = process.argv[2];
const env = process.argv[3];
let version;

if (!projectId) {
    console.log('\n' + '\x1B[31m%s\x1B[39m', '打包失败: 未输入项目名称');
    process.exit();
}

const name = getPkgName(projectId, env);

const pkgPath = globalPath.resolve(__dirname, '../package.json');
const electronConfigPath = globalPath.resolve(__dirname, '../devtools/electron-builder.json');
const imgPath = globalPath.resolve(__dirname, '../img');
const imgPackagePath = globalPath.resolve(__dirname, '../resources_package/img');
const resourcesPath = globalPath.resolve(__dirname, '../resources');
const iconPath = globalPath.resolve(__dirname, '../resources/icons');
const iconPackagePath = globalPath.resolve(__dirname, '../resources_package/icons');

// 修改 package.json 文件
console.log('修改 package.json 文件...');
let pkg = readJsonFileToObject(pkgPath);
version = pkg.version;
pkg.name = name.pkgName;
pkg.description = name.pkgDesc;
writeObjectToJsonFile(pkgPath, pkg);
console.log('\x1B[32m%s\x1B[39m', '完成!');

// 修改 electron 配置文件
console.log('修改 electron 配置文件...');
let electronConfig = readJsonFileToObject(electronConfigPath);
electronConfig.productName = name.projectNameZh;
electronConfig.appId = name.appId;
writeObjectToJsonFile(electronConfigPath, electronConfig);
console.log('\x1B[32m%s\x1B[39m', '完成!');

// 修改图片等资源文件
console.log('更新资源文件...');
removeDir(imgPath);
copyDir(globalPath.resolve(imgPackagePath, name.projectName), imgPath);
if (!fs.existsSync(resourcesPath)) {
    fs.mkdirSync(resourcesPath);
}
removeDir(iconPath);
copyDir(globalPath.resolve(iconPackagePath, name.projectName), iconPath);
console.log('\x1B[32m%s\x1B[39m', '完成!');

// 修改项目配置文件
console.log('更新项目配置文件...');
const urlConfigs = {
    prod: {
        hongqi: 'https://hongqi.wemark.tech/broadcast-push/',
        benteng: 'https://bentengyuan.automark.cc/broadcast-push/',
        weimaketang: 'https://yiqiedudev.automark.cc/broadcast-push/',
    },
    test: {
        hongqi: 'https://hongqizhibo.automark.cc/broadcast-push/',
        benteng: 'https://bentengyuan2.automark.cc/broadcast-push/',
        weimaketang: 'https://yiqiedudev.automark.cc/broadcast-push/',
    },
};
const urlConfig = `module.exports = {
    prod: ${env === ENV_PRODUCTION ? 1 : 0},
    url: "${urlConfigs[env === ENV_PRODUCTION ? 'prod' : 'test'][name.projectName]}"
};`;
fs.writeFileSync(globalPath.resolve(__dirname, '../appConfig.js'), urlConfig);
console.log('\x1B[32m%s\x1B[39m', '完成!');


const appName = name.projectNameZh + '_' + version;
console.log('\n' + '\x1B[32m%s\x1B[39m', '安装包名：' + appName);
console.log('\x1B[32m%s\x1B[39m', '开始打包文件...');

/**
 * 获取包名
 * @param projectId 项目名称
 * @param env 开发环境
 * @return {{pkgName: string, projectNameZh: string}}
 */
function getPkgName(projectId, env) {
    const pkgNameSuffix = env === ENV_PRODUCTION ? '' : (env === ENV_TEST ? '-cs' : '-dev');
    const projectNameSuffix = env === ENV_PRODUCTION ? '' : (env === ENV_TEST ? '-测试' : '开发环境');
    const appIdSuffix = env === ENV_PRODUCTION ? '' : (env === ENV_TEST ? 'cs' : 'dev');

    var projectName = 'hongqi';
    var projectNameZh = '红旗';
    var pkgName, pkgDesc, appId;

    switch (projectId) {
        case 'hongqi':
            projectName = 'hongqi';
            projectNameZh = '红旗';
            break;
        case 'benteng':
            projectName = 'benteng';
            projectNameZh = '奔腾';
            break;
        case 'weimaketang':
            projectName = 'weimaketang';
            projectNameZh = '维玛课堂';
    }

    pkgName = projectName + pkgNameSuffix;
    pkgDesc = projectNameZh + '直播' + projectNameSuffix;
    projectNameZh = projectNameZh + '直播' + projectNameSuffix;
    appId = 'zhibo.' + projectName + appIdSuffix;

    return {
        pkgName: pkgName,
        pkgDesc: pkgDesc,
        projectName: projectName,
        projectNameZh: projectNameZh,
        appId: appId
    };
}

/**
 * 删除文件夹
 * @param path 文件夹路径
 */
function removeDir(path) {
    if (fs.existsSync(path)) {
        const files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                removeDir(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

/**
 * 复制文件夹
 * @param sourcePath 源文件夹
 * @param targetPath 目标文件夹
 */
function copyDir(sourcePath, targetPath) {
    if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath);
    }
    if (fs.existsSync(sourcePath)) {
        const files = fs.readdirSync(sourcePath);
        files.forEach(function (file, index) {
            var curPath = globalPath.resolve(sourcePath, file);
            var tPath = globalPath.resolve(targetPath, file);
            if (fs.statSync(curPath).isDirectory()) {
                copyDir(curPath, tPath);
            } else {
                fs.copyFileSync(curPath, tPath);
            }
        });
    }
}

/**
 * 读 JSON 文件转换成 Object
 * @param {string} path 读取文件路径
 */
function readJsonFileToObject(path) {
    let file = fs.readFileSync(path, 'utf8');
    return JSON.parse(file)
}

/**
 * 将 Object 写入到 JSON 文件
 * @param path 写入文件路径
 * @param source 数据对象
 */
function writeObjectToJsonFile(path, source) {
    fs.writeFileSync(path, JSON.stringify(source, null, 4), 'utf8');
}

