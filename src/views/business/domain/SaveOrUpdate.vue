<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="唯一标识" prop="uniqueKey">
            <el-input v-model="form.uniqueKey"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="领域类型" prop="type">
            <el-select v-model="form.type" clearable>
              <el-option
                v-for="dict in dict.type.domain_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
        <el-col :span="12">
          <el-form-item label="排序号" prop="sort">
            <el-input v-model="form.sort"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="文本模型调整" prop="aboveContent">
            <el-input
              type="textarea"
              :rows="6"
              v-model="form.aboveContent"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="center">窗口参数配置</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否展示" prop="ifShow">
            <el-switch
              v-model="form.ifShow"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否热门" prop="ifHot">
            <el-switch
              v-model="form.ifHot"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="form.ifShow == 1">
        <el-row>
          <el-col :span="12">
            <el-form-item label="跳转路由" prop="routePath">
              <el-input v-model="form.routePath"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="SVG图标展示" prop="svgLogo">
              <el-input v-model="form.svgLogo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标题名称" prop="iconName">
              <el-input v-model="form.iconName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="副标题名称" prop="iconSubName">
              <el-input v-model="form.iconSubName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标路径" prop="iconPath">
              <ImageUpload
                :value="form.iconPath"
                :limit="1"
                @input="handleUploadIcon"
              ></ImageUpload>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="文本预设" prop="firstContent">
              <el-input
                type="textarea"
                :rows="3"
                v-model="form.firstContent"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">会话数据配置</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="会话标题" prop="title">
              <el-input v-model="windowData.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会话类型" prop="sessionType">
              <el-select v-model="windowData.sessionType" clearable>
                <el-option key="DOMAIN" label="领域会话" value="DOMAIN" />
                <el-option key="CHAT" label="普通会话" value="CHAT" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="内容响应类型" prop="contentShowType">
              <el-select v-model="windowData.contentShowType" clearable>
                <el-option key="Markdown" label="Markdown" value="Markdown" />
                <el-option key="Html" label="Html" value="Html" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="输入类型" prop="inputType">
              <el-select v-model="windowData.inputType" clearable>
                <el-option key="Input" label="文本输入框" value="Input" />
                <el-option
                  key="TrueOrFalse"
                  label="是/否"
                  value="TrueOrFalse"
                />
                <el-option
                  key="TrueOrFalseOrNK"
                  label="是/否/不确定"
                  value="TrueOrFalseOrNK"
                />
                <el-option
                  key="SelectABCD"
                  label="选项[A,B,C,D]"
                  value="SelectABCD"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row> 
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input
                type="textarea"
                :rows="3"
                v-model="windowData.description"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">前端输入配置</el-divider>
        <el-row>
          <div v-for="(item, rowIndex) in infomation" :key="rowIndex">
            <el-col :span="8">
              <el-form-item label="属性ID:" prop="propertyId">
                <el-input
                  v-model="item.propertyId"
                  placeholder="例如：地址/房型/交通等内容"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="属性值:" prop="propertyValue">
                <el-input v-model="item.propertyValue" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button @click="addItem()"> + </el-button>
                <el-button @click="deleteItem(index)">-</el-button>
              </el-form-item>
            </el-col>
          </div>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import api from "./api";

export default {
  name: "SaveOrUpdate",
  dicts: ["domain_type"],
  data() {
    return {
      form: {},
      windowData: {},
      infomation: {},
      rules: {
        uniqueKey: [
          { required: true, message: "唯一标识不能为空", trigger: "blur" },
        ],
        aboveContent: [
          { required: true, message: "文本模型调整", trigger: "blur" },
        ],
        type: [
          { required: true, message: "领域类型不能为空", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    form(val) {
      if (val == null || val == undefined) {
        this.windowData = {};
      } else {
        let windowData = val.windowData;
        if (windowData != null && Object.keys(windowData).length !== 0) {
          this.windowData = JSON.parse(windowData);
        } else {
          this.windowData = {};
        }
        let infomation = val.infomation;
        if (infomation != null && Object.keys(infomation).length !== 0) {
          this.infomation = JSON.parse(infomation);
        }
        // else {
        //   this.infomation = [{ propertyValue: "", property: ""}];
        // }
      }
    },
  },
  created() {},
  methods: {
    handleUploadIcon(val) {
      this.form.iconPath = val;
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let formData = JSON.parse(JSON.stringify(this.form));
          // windowData转换为json串
          formData.windowData = JSON.stringify(this.windowData);
          if (this.infomation != null && Object.keys(this.infomation).length !== 0) {
            formData.infomation = JSON.stringify(this.infomation);
          }
          console.log(formData);
          console.log(formData.infomation);
          if (formData.id != null && formData.id != "") {
            api.domainUpdate(formData).then((res) => {
              if (res.status) {
                this.$message.success(res.message);
                this.cancel();
              }
            });
          } else {
            api.domainInsert(formData).then((res) => {
              if (res.status) {
                this.$message.success(res.message);
                this.cancel();
              }
            });
          }
        }
      });
    },
    clearForm() {
      this.form = {};
    },
    cancel() {
      this.$emit("dialogClose");
    },
    addItem() {
      let that = this;
      that.infomation.push({
        propertyValue: "",
        propertyId: "",
      });
    },
    deleteItem(i) {
      if (this.infomation.length <= 1) {
        return false;
      }
      this.infomation.splice(i, 1);
    },
  },
};
</script>

<style scoped>
::v-deep .el-form-item {
  padding: 0 20px 0 20px;
}
::v-deep .el-form label {
  display: block;
  width: 20%;
  text-align: left;
  padding: 0 0 0 5px;
  font-size: 15px;
}
::v-deep .el-input {
  width:60%
}
::v-deep .el-select{
  width:60%
}
</style>
