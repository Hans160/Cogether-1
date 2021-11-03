const { User } = require('../../models');
const {
  isAuthorized,
  generateToken,
  sendToken,
} = require('../../utils/helpFunc');

module.exports = async (req, res) => {
  const { nickname, password } = req.body;
  const auth = isAuthorized(req);

  if (!auth) {
    return res.status(401).send({
      message: 'unauthorized user',
    });
  }

  try {
    const checkNickName = await User.findOne({
      where: {
        nickname: nickname,
      },
    });

    if (auth.id !== checkNickName.id) {
      return res.status(400).send({
        message: 'nickname is already exist',
      });
    }

    const userInfo = await User.findOne({
      where: {
        email: auth.email,
      },
    });

    if (req.file) {
      userInfo.image = req.file.location;
    }

    if (!req.file) {
      userInfo.image = null;
    }

    if (nickname) {
      userInfo.nickname = nickname;
    }

    if (password) {
      userInfo.password = password;
    }

    await userInfo.save();

    const payload = {
      id: userInfo.id,
      email: userInfo.email,
      image: userInfo.image,
      nickname: userInfo.nickname,
    };

    res.clearCookie('authorization', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
      domail: '/',
    });

    const accessToken = generateToken(payload);
    sendToken(res, accessToken);

    res.status(200).send({
      data: {
        accessToken: accessToken,
        id: userInfo.id,
        email: userInfo.email,
        image: userInfo.image,
        nickname: userInfo.nickname,
        login_type: userInfo.login_type,
        authorization: userInfo.authorization,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
      },
      message: 'update userinfo successed',
    });
  } catch (err) {
    console.log('error', err);
  }
};
