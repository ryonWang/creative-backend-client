import request from '@/utils/request'
const baseApi = "/module/app/banner/";

// 查询应用banner列表
export function listBanner(query) {
  return request({
    url: baseApi+'listByPage',
    method: 'get',
    params: query
  })
}

// 查询应用banner详细
export function getBanner(id) {
  return request({
    url: baseApi + id,
    method: 'get'
  })
}

// 新增应用banner
export function addBanner(data) {
  return request({
    url: baseApi+'add',
    method: 'post',
    data: data
  })

}

// 修改应用banner
export function updateBanner(data) {
  return request({
    url: baseApi + 'update',
    method: 'put',
    data: data
  })
}

// 删除应用banner
export function delBanner(id) {
  return request({
    url: baseApi + 'delete/' + id,
    method: 'delete'
  })
}

// banner上传
export function uploadBannerImg(data) {
  return request({
    url: baseApi + 'uploadBannerImg',
    method: 'post',
    data: data
  })
}
