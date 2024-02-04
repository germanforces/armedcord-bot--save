const { Schema, model } = require("mongoose");
const LivechatcreateSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userg: String,
    uname: String,
    uid: String,
    reason: String,
    endreason: String,
    channelid: String
})

module.exports = model("Livechatcreate", LivechatcreateSchema, "livechatcreate")