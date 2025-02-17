<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="名称" prop="bannerName">
          <el-input
            v-model="queryParams.bannerName"
            placeholder="请输入banner名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        
        <el-form-item label="类型值" prop="typeVal">
          <el-input
            v-model="queryParams.typeVal"
            placeholder="请输入类型值"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
  
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['modules:banner:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="Result.success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['modules:banner:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['modules:banner:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['modules:banner:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
  
      <el-table v-loading="loading" :data="bannerList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="名称" align="center" prop="bannerName" />
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <img :src="staticWebsite + scope.row.bannerImg" style="max-height: 50px;" />
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" prop="type" />
        <el-table-column label="类型值" align="center" prop="typeVal" />
        <el-table-column label="创建人" align="center" prop="createOper" />
        <el-table-column label="更新人" align="center" prop="updateOper" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['modules:banner:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['modules:banner:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
  
      <!-- 添加或修改应用banner对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="banner名称" prop="bannerName">
            <el-input v-model="form.bannerName" placeholder="请输入banner名称" />
          </el-form-item>
          <el-form-item label="上传图片" prop="bannerImg">
            <el-upload
              class="avatar-uploader"
              :action="uploadImgUrl"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
              :before-upload="beforeUpload"
              :headers="headers"
              name="bannerImg"
              :limit="1"
              :on-exceed="handleExceed">
              <img v-if="form.bannerImg" :src="staticWebsite + form.bannerImg" class="avatar">
              <el-button v-else size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择类型">
              <el-option label="不跳转" value="0" />
              <el-option label="跳转" value="1" />
              <el-option label="弹窗" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="类型值" prop="typeVal">
            <el-input v-model="form.typeVal" placeholder="请输入类型值" />
          </el-form-item>
          <el-form-item label="是否启用" prop="delFlag">
            <el-switch
              v-model="form.delFlag"
              :active-value="0"
              :inactive-value="1"
              active-text="启用"
              inactive-text="禁用">
            </el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { listBanner, getBanner, delBanner, addBanner, updateBanner } from "@/api/appFront/banner";
  import { getToken } from "@/utils/auth";
  
  export default {
    name: "Banner",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 应用banner表格数据
        bannerList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        staticWebsite: '',
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          bannerName: null,
          bannerImg: null,
          type: null,
          typeVal: null,
          createOper: null,
          updateOper: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          bannerName: [
            { required: true, message: "banner名称不能为空", trigger: "blur" }
          ],
          bannerImg: [
            { required: true, message: "banner地址不能为空", trigger: "blur" }
          ],
          type: [
            { required: true, message: "类型不能为空", trigger: "change" }
          ],
         
        },
        // 上传图片地址
        uploadImgUrl: process.env.VUE_APP_BASE_API + '/module/app/banner/uploadBannerImg',
        // 上传头像的请求头
        headers: {
          Authorization: 'Bearer ' + getToken()
        }
      };
    },
    created() {
      this.getList();
      this.staticWebsite = this.$store.getters.configMain.staticWebsite;
    },
    methods: {
      /** 查询应用banner列表 */
      getList() {
        this.loading = true;
        listBanner(this.queryParams).then(response => {
          this.bannerList = response.data;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          bannerName: null,
          bannerImg: null,
          type: null,
          typeVal: null,
          delFlag: null,
          createTime: null,
          createOper: null,
          updateTime: null,
          updateOper: null
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加应用banner";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getBanner(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改应用banner";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateBanner(this.form).then(response => {
                this.$modal.msgResult.success("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addBanner(this.form).then(response => {
                this.$modal.msgResult.success("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$modal.confirm('是否确认删除应用banner编号为"' + ids + '"的数据项？').then(function() {
          return delBanner(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgResult.success("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('modules/banner/export', {
          ...this.queryParams
        }, `banner_${new Date().getTime()}.xlsx`)
      },
      // 上传前校验
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG/PNG 格式!');
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
          return false;
        }
        return true;
      },
      // 上传成功回调
      handleUploadSuccess(res, file) {
        if (res.code === 200) {
          this.form.bannerImg = res.data;
          this.$modal.msgSuccess("上传成功");
        } else {
          this.$modal.msgError("上传失败");
        }
      },
      // 超出限制的处理
      handleExceed(files, file) {
        this.$message.error('只能上传一张图片!');
      }
    }
  };
  </script>
  
  <style scoped>
  .avatar-uploader .avatar {
    width: 200px;
    height: 200px;
    display: block;
  }
  </style>
  