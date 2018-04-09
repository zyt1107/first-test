<template>
    <!-- 调用inputFocus()唤起文件上传 -->
    <div ref="upload">
        <label for="upload" class="upload" style="display:none;">+</label>
        <input id="upload" type="file" accept="image/*" name="" value="" style="display:none;" @change="handleInputChange($event)" ref="input">
    </div>
</template>
<script type="text/javascript">
    import axios from 'axios';
    const imgFile = {};
    export default {
        data() {
            return {};
        },
        methods: {
            inputFocus() {
                this.$refs.input.click();
            },
            handleInputChange(event) {
                const file = event.target.files[0];
                const imgMasSize = 1024 * 1024 * 10; // 10MB
                if (!file) {
                    return;
                }
                // 检查文件类型
                if (['jpeg', 'png', 'gif', 'jpg'].indexOf(file.type.split('/')[1]) < 0) {
                    // 自定义报错方式
                    console.log('文件类型仅支持 jpeg/png/gif！');
                    return;
                }

                // 文件大小限制
                if (file.size > imgMasSize) {
                    // 文件大小自定义限制
                    console.log('文件大小不能超过10MB！');
                    return;
                }

                // 判断是否是ios
                if (window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                    // ios
                    this.transformFileToFormData(file);
                    return;
                }

                // 图片压缩之旅
                this.transformFileToDataUrl(file);
            },
            // 将File append进 FormData
            transformFileToFormData (file) {
                const formData = new FormData();
                // 自定义formData中的内容
                // type
                formData.append('type', file.type || 'image/jpeg');
                // size
                formData.append('size', file.size);
                // name
                formData.append('name', file.name);
                // lastModifiedDate
                formData.append('lastModifiedDate', file.lastModifiedDate);
                // append 文件
                formData.append('file', file);
                // 上传图片
                this.uploadImg(formData);
            },
            // 将file转成dataUrl
            transformFileToDataUrl (file) {
                console.log('transformFileToDataUrl');
                var self = this;
                const imgCompassMaxSize = 200 * 1024; // 超过 200k 就压缩

                // 存储文件相关信息
                imgFile.type = file.type || 'image/jpeg'; // 部分安卓出现获取不到type的情况
                imgFile.size = file.size;
                imgFile.name = file.name;
                imgFile.lastModifiedDate = file.lastModifiedDate;

                // 封装好的函数
                const reader = new FileReader();

                // file转dataUrl是个异步函数，要将代码写在回调里
                reader.onload = function(e) {
                    const result = e.target.result;
                    if (result.length < imgCompassMaxSize) {
                        console.log('图片不压缩');
                        self.compress(result, self.processData, false);    // 图片不压缩
                    } else {
                        console.log('图片压缩');
                        self.compress(result, self.processData);            // 图片压缩
                    }
                };

                reader.readAsDataURL(file);
            },
            // 使用canvas绘制图片并压缩
            compress (dataURL, callback, shouldCompress = true) {
                var self = this;
                console.log('compress');
                const img = new window.Image();

                img.src = dataURL;

                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    canvas.width = img.width;
                    canvas.height = img.height;

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    let compressedDataUrl;

                    if (shouldCompress) {
                        compressedDataUrl = canvas.toDataURL(imgFile.type, 0.2);
                    } else {
                        compressedDataUrl = canvas.toDataURL(imgFile.type, 1);
                    }
                    callback(compressedDataUrl);
                };
            },
            processData (dataURL) {
                // 这里使用二进制方式处理dataUrl
                const binaryString = window.atob(dataURL.split(',')[1]);
                const arrayBuffer = new ArrayBuffer(binaryString.length);
                const intArray = new Uint8Array(arrayBuffer);

                for (let i = 0, j = binaryString.length; i < j; i++) {
                    intArray[i] = binaryString.charCodeAt(i);
                }

                const data = [intArray];

                let blob;

                try {
                    blob = new Blob(data, { type: imgFile.type });
                } catch (error) {
                    window.BlobBuilder = window.BlobBuilder ||
                        window.WebKitBlobBuilder ||
                        window.MozBlobBuilder ||
                        window.MSBlobBuilder;
                    if (error.name === 'TypeError' && window.BlobBuilder) {
                        const builder = new BlobBuilder();
                        builder.append(arrayBuffer);
                        blob = builder.getBlob(imgFile.type);
                    } else {
                        console.log('版本过低，不支持上传图片');
                    }
                }

                // blob 转file
                const fileOfBlob = new File([blob], imgFile.name);
                const formData = new FormData();

                // type
                formData.append('type', imgFile.type);
                // size
                formData.append('size', fileOfBlob.size);
                // name
                formData.append('name', imgFile.name);
                // lastModifiedDate
                formData.append('lastModifiedDate', imgFile.lastModifiedDate);
                // append 文件
                formData.append('file', fileOfBlob);
                // console.log(formData.get('file'));

                this.uploadImg(formData);
            },
            // 上传图片
            uploadImg (formData) { // 父组件发送请求
                this.$emit('uploadFile', formData);
            }
        }
    };
</script>
<style type="text/css">
    .upload {
        color: #d5d5d6;
        margin: 0;
        height: 57px;
        border-radius: 10px;
        width: 57px;
        text-align: center;
        font-size: 50px;
        line-height: 57px;
        border: 1px dashed #999 !important;
    }
</style>