const express = require('express')
const router = express.Router()

// 挂载路由

// 导入路由处理函数模块
const userinfo_handler = require('../router_handler/userinfo')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user')

// 获取搜索的用户基本信息
router.post('/getUsersOne',userinfo_handler.getUsersOne)
// 分页获取用户基本信息的路由
router.post('/pageuser',userinfo_handler.getpageuser)
// 获取所有用户基本信息的路由
router.get('/users',userinfo_handler.getUsers)
// 获取当前用户基本信息的路由
router.get('/userinfo', userinfo_handler.getUserInfo)
// 更新用户信息的路由
router.post('/userinfo',  userinfo_handler.updateUserInfo)
// 根据id更新用户信息的路由
router.post('/userinfoid/:id',  userinfo_handler.updateUserId)
// 根据id查看用户信息的路由
router.get('/userinfoid/:id',  userinfo_handler.getdateUserId)
// 根据id删除用户信息的路由
router.get('/deleteuserinfoid/:id',  userinfo_handler.deletedateUserId)
// 更新密码的路由
router.post('/updatepwd',  userinfo_handler.updatePassword)
// 更换头像的路由
router.post('/update/avatar',  userinfo_handler.updateAvatar)

module.exports = router
