const router = require("express").Router()
const mongoose = require("mongoose")
const auth = require("../middleware/auth")
const Notification = mongoose.model("Notification")
const admin = require('firebase-admin')
let serviceAccount = require("../file/ctct-16b49-firebase-adminsdk-8lesv-5eba9083a5.json");
let serviceAccountSiQuocDan = require("../file/siquocdan-firebase-adminsdk-m48pg-5227e2ccf8.json");
let serviceAccountDucHoa = require("../file/duc-hoa-online-firebase-adminsdk-g6bdw-d15bef2a9b.json");
let serviceAccountStmnBinhDuong = require("../file/shopmini-9230e-firebase-adminsdk-89h0h-30315469be.json");
let serviceAccountHungHa = require("../file/bach-hoa-hung-ha-firebase-adminsdk-5cqae-221fc7ec52.json");
const _ctct = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ctct-16b49.firebaseio.com"
},
"ctct"
);
const _siquocdan = admin.initializeApp({
    credential: admin.credential.cert(serviceAccountSiQuocDan),
    databaseURL: "https://siquocdan.firebaseio.com"
},
"siquocdan"
);
const _duchoa = admin.initializeApp({
    credential: admin.credential.cert(serviceAccountDucHoa),
    databaseURL: "https://duc-hoa-online.firebaseio.com"
},
"duchoa"
);
const _stmnBinhDuong = admin.initializeApp({
    credential: admin.credential.cert(serviceAccountStmnBinhDuong),
    databaseURL: "https://shopmini-9230e.firebaseio.com"
},
"stmnbinhduong"
);
const _hungha = admin.initializeApp({
    credential: admin.credential.cert(serviceAccountHungHa),
    databaseURL: "https://bach-hoa-hung-ha.firebaseio.com"
},
"hungha"
);

const dbSiQuocDan = _siquocdan.firestore();
const dbDucHoa = _duchoa.firestore();
const dbStmnBinhDuong = _stmnBinhDuong.firestore();
const dbHungHa = _hungha.firestore();

router.post("/list_notification", auth, async (req, res) => {
    const {offset, limit} = req.body
    const list_result = await Notification.find({to: req.user._id}).populate({
        path: "from",
        select: "_id name img_avatar"
    })
    .populate({
        path: "to",
        select: "_id name img_avatar"
    })
    .skip(offset).limit(limit).sort({created_at: -1});
    res.send({
        status  : true,
        message : null,
        data    : list_result
    })
})
//si quoc dan
router.post("/siquocdan/send_notification_for_admin", async (req, res, next) => {
    const {order_id} = req.body;
    if (order_id == null) {
        const error = new Error('Please enter full fill')
        error.httpStatusCode = 400
        return next(error)
    } else {
        var payload = {
            "notification": {
              "title": "Đơn hàng mới",
              "body": "Đơn hàng " + order_id +  " vừa đặt. Vui lòng vào xem đơn hàng để giao.",
              'sound': 'default',
              'notification_android_sound': "default"
            },
            "data": {
              "click_action": "ACTION_USER_ORDER"
            }
        };
        var options = {
            "priority": "high",
            "timeToLive": 60 * 60 *24,
        };
        dbSiQuocDan.collection("admin_tokens").get().then(async (docs) => {
            var fcm = [];
            docs.forEach(doc => {
                fcm.push(doc.data().fcm_token);
            });
            for (i = 0; i < fcm.length; i += 1000) {
                var lastIndex = i + 1000
                if (lastIndex > fcm.length) {
                    lastIndex = fcm.length;
                }
                await _siquocdan.messaging().sendToDevice(fcm.slice(i, lastIndex), payload, options);
            }
            res.send({
                status  : true,
                message : "Success",
            })
        })
    }
});

router.post("/siquocdan/admin_send_notification", async (req, res, next) => {
    const {title, message} = req.body;
    if (title == "" || message == "" || title == null || message == null) {
        const error = new Error('Please enter full fill')
        error.httpStatusCode = 400
        return next(error)
    } else {
        var payload = {
            "notification": {
              "title": title,
              "body": message,
              'sound': 'default',
              'notification_android_sound': "default"
            },
            "data": {
              "click_action": "ACTION_ADMIN_SEND_NOTIFICATION"
            }
        };
        var options = {
            "priority": "high",
            "timeToLive": 60 * 60 *24,
        };
        dbSiQuocDan.collection("tokens").get().then(async (docs) => {
            var fcm = [];
            docs.forEach(doc => {
                fcm.push(doc.data().fcm_token);
            });
            for (i = 0; i < fcm.length; i += 1000) {
                var lastIndex = i + 1000
                if (lastIndex > fcm.length) {
                    lastIndex = fcm.length;
                }
                await _siquocdan.messaging().sendToDevice(fcm.slice(i, lastIndex), payload, options);
            }
            res.send({
                status  : true,
                message : "Success",
            })
        })
    }
});
//duc hoa
router.post("/duchoa/send_notification_for_admin", async (req, res, next) => {
    const {order_id} = req.body;
    if (order_id == null) {
        const error = new Error('Please enter full fill')
        error.httpStatusCode = 400
        return next(error)
    } else {
        var payload = {
            "notification": {
              "title": "Đơn hàng mới",
              "body": "Đơn hàng " + order_id +  " vừa đặt. Vui lòng vào xem đơn hàng để giao.",
              'sound': 'default',
              'notification_android_sound': "default"
            },
            "data": {
              "click_action": "ACTION_USER_ORDER"
            }
        };
        var options = {
            "priority": "high",
            "timeToLive": 60 * 60 *24,
        };
        dbDucHoa.collection("admin_tokens").get().then(async (docs) => {
            var fcm = [];
            docs.forEach(doc => {
                fcm.push(doc.data().fcm_token);
            });
            for (i = 0; i < fcm.length; i += 1000) {
                var lastIndex = i + 1000
                if (lastIndex > fcm.length) {
                    lastIndex = fcm.length;
                }
                await _duchoa.messaging().sendToDevice(fcm.slice(i, lastIndex), payload, options);
            }
            res.send({
                status  : true,
                message : "Success",
            })
        })
    }
});

router.post("/duchoa/admin_send_notification", async (req, res, next) => {
    const {title, message} = req.body;
    if (title == "" || message == "" || title == null || message == null) {
        const error = new Error('Please enter full fill')
        error.httpStatusCode = 400
        return next(error)
    } else {
        var payload = {
            "notification": {
              "title": title,
              "body": message,
              'sound': 'default',
              'notification_android_sound': "default"
            },
            "data": {
              "click_action": "ACTION_ADMIN_SEND_NOTIFICATION"
            }
        };
        var options = {
            "priority": "high",
            "timeToLive": 60 * 60 *24,
        };
        dbDucHoa.collection("tokens").get().then(async (docs) => {
            var fcm = [];
            docs.forEach(doc => {
                fcm.push(doc.data().fcm_token);
            });
            for (i = 0; i < fcm.length; i += 1000) {
                var lastIndex = i + 1000
                if (lastIndex > fcm.length) {
                    lastIndex = fcm.length;
                }
                await _duchoa.messaging().sendToDevice(fcm.slice(i, lastIndex), payload, options);
            }
            res.send({
                status  : true,
                message : "Success",
            })
        })
    }
});

//mini binh duong
router.post("/stmnbinhduong/send_notification_for_admin", async (req, res, next) => {
    const {order_id} = req.body;
    if (order_id == null) {
        const error = new Error('Please enter full fill')
        error.httpStatusCode = 400
        return next(error)
    } else {
        var payload = {
            "notification": {
              "title": "Đơn hàng mới",
              "body": "Đơn hàng " + order_id +  " vừa đặt. Vui lòng vào xem đơn hàng để giao.",
              'sound': 'default',
              'notification_android_sound': "default"
            },
            "data": {
              "click_action": "ACTION_USER_ORDER"
            }
        };
        var options = {
            "priority": "high",
            "timeToLive": 60 * 60 *24,
        };
        dbStmnBinhDuong.collection("admin_tokens").get().then(async (docs) => {
            var fcm = [];
            docs.forEach(doc => {
                fcm.push(doc.data().fcm_token);
            });
            for (i = 0; i < fcm.length; i += 1000) {
                var lastIndex = i + 1000
                if (lastIndex > fcm.length) {
                    lastIndex = fcm.length;
                }
                await _stmnBinhDuong.messaging().sendToDevice(fcm.slice(i, lastIndex), payload, options);
            }
            res.send({
                status  : true,
                message : "Success",
            })
        })
    }
});

router.post("/stmnbinhduong/admin_send_notification", async (req, res, next) => {
    const {title, message} = req.body;
    if (title == "" || message == "" || title == null || message == null) {
        const error = new Error('Please enter full fill')
        error.httpStatusCode = 400
        return next(error)
    } else {
        var payload = {
            "notification": {
              "title": title,
              "body": message,
              'sound': 'default',
              'notification_android_sound': "default"
            },
            "data": {
              "click_action": "ACTION_ADMIN_SEND_NOTIFICATION"
            }
        };
        var options = {
            "priority": "high",
            "timeToLive": 60 * 60 *24,
        };
        dbStmnBinhDuong.collection("tokens").get().then(async (docs) => {
            var fcm = [];
            docs.forEach(doc => {
                fcm.push(doc.data().fcm_token);
            });
            for (i = 0; i < fcm.length; i += 1000) {
                var lastIndex = i + 1000
                if (lastIndex > fcm.length) {
                    lastIndex = fcm.length;
                }
                await _stmnBinhDuong.messaging().sendToDevice(fcm.slice(i, lastIndex), payload, options);
            }
            res.send({
                status  : true,
                message : "Success",
            })
        })
    }
});

//hung ha
router.post("/hungha/send_notification_for_admin", async (req, res, next) => {
    const {order_id} = req.body;
    if (order_id == null) {
        const error = new Error('Please enter full fill')
        error.httpStatusCode = 400
        return next(error)
    } else {
        var payload = {
            "notification": {
              "title": "Đơn hàng mới",
              "body": "Đơn hàng " + order_id +  " vừa đặt. Vui lòng vào xem đơn hàng để giao.",
              'sound': 'default',
              'notification_android_sound': "default"
            },
            "data": {
              "click_action": "ACTION_USER_ORDER"
            }
        };
        var options = {
            "priority": "high",
            "timeToLive": 60 * 60 *24,
        };
        dbHungHa.collection("admin_tokens").get().then(async (docs) => {
            var fcm = [];
            docs.forEach(doc => {
                fcm.push(doc.data().fcm_token);
            });
            for (i = 0; i < fcm.length; i += 1000) {
                var lastIndex = i + 1000
                if (lastIndex > fcm.length) {
                    lastIndex = fcm.length;
                }
                await _hungha.messaging().sendToDevice(fcm.slice(i, lastIndex), payload, options);
            }
            res.send({
                status  : true,
                message : "Success",
            })
        })
    }
});

router.post("/hungha/admin_send_notification", async (req, res, next) => {
    const {title, message} = req.body;
    if (title == "" || message == "" || title == null || message == null) {
        const error = new Error('Please enter full fill')
        error.httpStatusCode = 400
        return next(error)
    } else {
        var payload = {
            "notification": {
              "title": title,
              "body": message,
              'sound': 'default',
              'notification_android_sound': "default"
            },
            "data": {
              "click_action": "ACTION_ADMIN_SEND_NOTIFICATION"
            }
        };
        var options = {
            "priority": "high",
            "timeToLive": 60 * 60 *24,
        };
        dbHungHa.collection("tokens").get().then(async (docs) => {
            var fcm = [];
            docs.forEach(doc => {
                fcm.push(doc.data().fcm_token);
            });
            for (i = 0; i < fcm.length; i += 1000) {
                var lastIndex = i + 1000
                if (lastIndex > fcm.length) {
                    lastIndex = fcm.length;
                }
                await _hungha.messaging().sendToDevice(fcm.slice(i, lastIndex), payload, options);
            }
            res.send({
                status  : true,
                message : "Success",
            })
        })
    }
});

module.exports = router;
