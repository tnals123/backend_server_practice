
module.exports = () => {

    return {

      checkSignUpForm : (userId,userPw,userPhone,userName,callback) => {

        console.log("오류!!")

        console.log(userName)

        var id = RegExp(/^[a-z0-9]{4,12}$/)
        var pass = RegExp(/^[A-Za-z0-9`~!@#\$%\^&\*\(\)\{\}\[\]\-_=\+\\|;:'"<>,\./\?]{8,20}$/)
        var phone = RegExp(/\d{3}\d{4}\d{4}/)
        var named = RegExp(/^[가-힣]+$/)

        if (!id.test(userId)){
            return callback("아이디 형식 오류")
        }
        else if (!pass.test(userPw)){
            return callback("비밀번호 형식 오류")
        }
        else if (!phone.test(userPhone)){
            return callback("전화번호 형식 오류")
        }
        else if (!named.test(userName)){
            return callback("닉네임 형식 오류")
        }
        else if (userPw = "" || userPhone == "" || userName == ""){
            return callback("빈칸 오류")
        }
        else{
            return callback("통과")
        }

      },
    }
  };