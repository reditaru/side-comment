(function(){
    var id =5;
    $.when(
        $.ajax({
            url:"http://localhost:3000/users/1",
            error:function(e){
                console.log(e)
            }
        }),
        $.ajax({
            url:"http://localhost:3000/posts/1",
            success:function(post){
                $(".post").html(marked(post.content))
            },
            error:function(e){
                console.log(e)
            }
        })
    ).done(function(user,post){
        $.ajax({
            url:"http://localhost:3000/comments?postId=1&_expand=user",
            success:function(data){
                sideComment = new SideComment(".post",user[0],1,data);
                $(sideComment).on("notLogin",function(){
                    console.log("Not Login!");
                });
                $(sideComment).on("postComment",function(event,payload){
                    console.log(payload);
                    var comment =   {
                        "id": id++,
                        "body": payload.body,
                        "postId": 1,
                        "section": payload.section,
                        "userId": payload.user.id,
                        "date": "Fri Feb 02 2018 04:35:39 GMT+0800 (中国标准时间)",
                        "parent": payload.parent,
                        "user": payload.user
                      };
                    sideComment.insertComment(comment)
                });
            },
            error:function(e){
                console.log(e)
            }
        });
    });
})()