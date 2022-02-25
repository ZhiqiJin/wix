<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" type="success" icon="el-icon-refresh" @click="loadListPager" />
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate" />
    </div>

    <el-table
      :key="tableKey" v-loading="tableListLoading" :data="tableList"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      :default-sort="{prop: 'lastUpdateDateTime', order: 'descending'}"
      border fit highlight-current-row style="width: 100%;"
      @sort-change="tableOrder"
    >
      <el-table-column sortable align="center" label="Title" width="250">
        <template slot-scope="scope">
          <el-link :href="scope.row.wixLink" v-if="scope.row.wixType === 200" target="_blank" class="buttonText"  type="primary" :underline="false">
            <el-popover placement="top-start" trigger="hover" :disabled="scope.row.wixTitle.length <= 10">
                <div>{{ scope.row.wixTitle }}</div>
                <span slot="reference" v-if="scope.row.wixTitle.length <= 30">{{scope.row.wixTitle}}</span>
                <span slot="reference" v-if="scope.row.wixTitle.length > 30">{{scope.row.wixTitle.substr(0, 30) + "..."}}</span>
            </el-popover>
          </el-link>
          <el-popover placement="top-start" v-if="scope.row.wixType === 100" trigger="hover" :disabled="scope.row.wixTitle.length <= 10">
            <div>{{ scope.row.wixTitle }}</div>
            <span slot="reference" v-if="scope.row.wixTitle.length <= 30">{{scope.row.wixTitle}}</span>
            <span slot="reference" v-if="scope.row.wixTitle.length > 30">{{scope.row.wixTitle.substr(0, 30) + "..."}}</span>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="wixAuthor" label="Author" sortable width="180" />
      <el-table-column prop="wixTypesetting" label="Editor" sortable width="180" />
      <el-table-column prop="wixPublishing" label="Publisher" sortable width="180" />
      <el-table-column prop="wixType" label="Source Type" sortable width="180">
        <template slot-scope="scope">
          {{ scope.row.wixType | wixTypeFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="wixReleaseDate" label="Date" sortable width="100" />
<!--      <el-table-column prop="wixLink" label="Link" sortable width="300">-->
<!--        <template slot-scope="scope">-->
<!--          <div v-if="scope.row.wixLink.indexOf('http') != -1">-->
<!--            <el-link :underline="false" :href="scope.row.wixLink" target="_blank">-->
<!--              <el-popover placement="top-start" width="300" trigger="hover" :disabled="scope.row.wixLink.length <= 10">-->
<!--                <div>{{ scope.row.wixLink }}</div>-->
<!--                <span slot="reference" v-if="scope.row.wixSummary.length <= 30">{{scope.row.wixLink}}</span>-->
<!--                <span slot="reference" v-if="scope.row.wixSummary.length > 30">{{scope.row.wixLink.substr(0, 30) + "..."}}</span>-->
<!--              </el-popover>-->
<!--            </el-link>-->
<!--          </div>-->
<!--          <div v-else>-->
<!--            <el-popover placement="top-start" trigger="hover" :disabled="scope.row.wixLink.length <= 10">-->
<!--              <div>{{ scope.row.wixLink }}</div>-->
<!--              <span slot="reference" v-if="scope.row.wixLink.length <= 20">{{scope.row.wixLink}}</span>-->
<!--              <span slot="reference" v-if="scope.row.wixLink.length > 20">{{scope.row.wixLink.substr(0, 20) + "..."}}</span>-->
<!--            </el-popover>-->
<!--          </div>-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column sortable="false" align="center" label="Abstract" width="300">
        <template slot-scope="scope">
          <el-popover placement="top-start" trigger="hover" :disabled="scope.row.wixSummary.length <= 10">
            <div>{{ scope.row.wixSummary }}</div>
            <span slot="reference" v-if="scope.row.wixSummary.length <= 30">{{scope.row.wixSummary}}</span>
            <span slot="reference" v-if="scope.row.wixSummary.length > 30">{{scope.row.wixSummary.substr(0, 30) + "..."}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="lastUpdateDateTime" label="Last Update Date" sortable width="160" />
      <el-table-column label="Operate" align="center" class-name="small-padding fixed-width" width="250">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" @click="handleUpdate(row)" />
          <el-button type="warning" icon="el-icon-document-copy" @click="handleCopy(row)" />
          <el-button v-if="row.status!='deleted'" type="danger" icon="el-icon-delete" @click="handleDelete(row,$index)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="tableQuery.total>0" style=" margin-top: 0px;" :total="tableQuery.total" :page.sync="tableQuery.currentPage" :limit.sync="tableQuery.pageSize" @pagination="paginationPager" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="Title" prop="wixTitle">
              <el-input ref="roleName" v-model="temp.wixTitle" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Author" prop="wixAuthor">
              <el-input ref="roleName" v-model="temp.wixAuthor" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Source Type" prop="wixType">
              <el-radio-group v-model="temp.wixType">
                <el-radio :label="item.key" v-for="item in wixTypeList">{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Editor" prop="wixTypesetting">
              <el-input ref="roleName" v-model="temp.wixTypesetting" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Publisher" prop="wixPublishing">
              <el-input v-model="temp.wixPublishing" maxlength="255" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Date" prop="wixReleaseDate">
              <el-date-picker v-model="temp.wixReleaseDate" value-format="yyyy-MM-dd" type="date" placeholder="select date" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Link" prop="wixLink">
              <el-input v-model="temp.wixLink" maxlength="255" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Abstract" prop="wixSummary">
              <el-input v-model="temp.wixSummary" maxlength="255" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="Content" prop="wixContent">
              <el-input v-model="temp.wixContent" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button :loading="formLoading" type="primary" @click="formSave()">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { wixGet, wixFindList, wixCreate, wixUpdate, wixDelete } from '@/api/wix'
import Pagination from '@/components/Pagination'

const wixTypeMap = [{key:100,value:'Online Sources'}, {key:200,value:'Printed Sources'}]

export default {
  name: 'WixFile',
  components: { Pagination,wixTypeMap },
  filters: {
    wixTypeFilter(value) {
      var result = ''
      wixTypeMap.forEach(item => {
        if(item.key === value){
          result = item.value
        }
      })
      return result;
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      tableList: [],
      tableListLoading: true,
      tableQuery: {
        total: 100,
        currentPage: 1,
        pageSize: 10
      },

      dialogFormVisible: false,
      formLoading: false,
      dialogStatus: '',
      wixTypeList: wixTypeMap,
      textMap: {
        update: 'Edit',
        create: 'Add'
      },
      rules: {
        wixTitle: [{ required: true, message: 'The title can not be blank', trigger: 'blur' }],
        wixAuthor: [{ required: true, message: 'Author cannot be empty', trigger: 'blur' }]
      },
      temp: {
        id: undefined,
        wixTitle: undefined,
        wixAuthor: undefined,
        wixTypesetting: undefined,
        wixPublishing: undefined,
        wixType: undefined,
        wixLink: undefined,
        wixReleaseDate: undefined,
        wixSummary: undefined,
        wixContent: undefined
      }
    }
  },
  created() {
    this.loadListPager()
  },
  methods: {
    loadListPager() {
      wixFindList({ 'id': 10086, 'name': 'zhangsan' }).then(response => {
        this.list = response.data.items
        this.tableQuery.total = this.list.length
        this.tableListLoading = false
        this.paginationPager()
      })
    },
    tableOrder(column, prop, order) {
      this.list.sort(function(a, b) {
        var nameA = a[column.prop].toUpperCase() // ignore upper and lowercase
        var nameB = b[column.prop].toUpperCase() // ignore upper and lowercase
        if (nameA < nameB) {
          return column.order === 'ascending' ? -1 : 1
        }
        if (nameA > nameB) {
          return column.order === 'ascending' ? 1 : -1
        }
        return 0
      })
    },
    paginationPager() {
      this.tableList = this.list.slice(((this.tableQuery.currentPage - 1) * this.tableQuery.pageSize), (this.tableQuery.currentPage * this.tableQuery.pageSize))
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        wixTitle: '',
        wixAuthor: '',
        wixTypesetting: '',
        wixPublishing: '',
        wixType: 100,
        wixLink: '',
        wixReleaseDate: '',
        wixSummary: '',
        wixContent: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    formSave() {
      if (this.temp.id) {
        wixUpdate(this.temp).then(res => {
          this.$message({ message: 'Successful operation', type: 'success' })
          this.dialogFormVisible = false
          this.loadListPager()
        })
      } else {
        wixCreate(this.temp).then(res => {
          this.$message({ message: 'Successful operation', type: 'success' })
          this.dialogFormVisible = false
          this.loadListPager()
        })
      }
    },
    handleUpdate(row) {
      this.resetTemp()
      this.temp = row
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleCopy(row) {
      this.resetTemp()
      this.temp = row
      this.temp.id = undefined
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleDelete(row, index) {
      this.$confirm('Are you sure you want to delete?', 'Confirm information', { distinguishCancelAndClose: true, confirmButtonText: '保存', cancelButtonText: '取消' }).then(() => {
        wixDelete(row.id).then(res => {
          this.$message({ message: 'Successful operation', type: 'success' })
          this.loadListPager()
        })
      })
    },

  }
}
</script>
