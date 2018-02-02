function SideComment(el,currentUser,postId,comments){
    var _this = this;
    this.el = el;
    this.currentUser = currentUser;
    this.comments = comments;
    this.postId = postId;
    commentStats = {};
    if(window.innerWidth<768){
        console.log('The viewport width did not satisfy the min width to get best experience!');
        return;
    }
    $(el).css("width","80%").addClass("side-comment-close");
    $(el).children("p").each(function(index,element){
        $(element).css("padding-right","30px").css("position","relative").attr("id",index);
        var $icon = $('<a></a>').attr("href","javascript:void(0);").append("<span></span>");
        var $iconwrapper = $('<div></div>').addClass("side-comment").append($icon)
        .append('<div class="comment-wrapper"><ul class="comments"></ul></div>');
        commentStats[index] = 0;
        $(element).append($iconwrapper);
    });
    var handleComment = function(value){
        var body="";
        var currentId;
        if(value.parent!="null"){
            body += '<span class="reply">Reply to ';
            comments.filter(function(v){return v.section == value.section}).
            forEach(function(v,i){
                if(v.id == value.parent){
                    body+="#"+i;
                }
            });
            body +=':</span>';
        }
        comments.filter(function(v){return v.section == value.section}).
        forEach(function(v,i){
            if(v.id == value.id){
                currentId = i;
            }
        });
        body += value.body;
        var $comment = $(`<li>
                            <div class="avatar"><img height="32" width="32" src="`+ value.user.avatar+`"></div>
                            <div class="name">`+ value.user.name +`</div>
                            <div class="number">#`+currentId+`</div>
                            <div class="date">`+ new Date(value.date).toDateString()+`</div>
                            <div class="content">`+body+`</div>
                            <a class="reply-comment">Reply</a>
                            </li>`)
            .attr("data-comment-id",value.id);
        $(el).find("p#"+value.section+" .side-comment .comments")
            .append($comment);
        $($comment).find(".reply-comment").click(function(e){
            e.stopPropagation();
            handleInsert(this);
        })
    }
    comments.forEach(function(value){
        commentStats[value.section]++;
        handleComment(value);
    });
    Object.keys(commentStats).forEach(function(v){
        $(el).find("p#"+v+" .side-comment>a span").text(commentStats[v]===0? "+":commentStats[v]);
        $(el).find("p#"+v+" .side-comment>a").css("display",commentStats[v]===0? "none":"block").attr("clicking",false);
        $(el).find("p#"+v+" .side-comment .comments").append('<a class="add-comment">Leave a Comment</a>');
        $(el).find("p#"+v+" .side-comment").hover(function(){
            $(el).find("p#"+v+" .side-comment>a").addClass("active");
        },function(){
            if($(el).find("p#"+v+" .side-comment>a").attr("clicking")==="false")
                $(el).find("p#"+v+" .side-comment>a").removeClass("active");
        }).children("a").click(function(e){
            e.stopPropagation();
            var last = $(el).find("p .side-comment>a[clicking=true]").parent().parent().attr("id");
            removeAllEdit(last);
            $(el).find("p .side-comment>a").attr("clicking",false).removeClass("active");
            $("p .side-comment .comment-wrapper").css("display","none");
            $(el).find("p#"+v+" .side-comment>a").attr("clicking",true).addClass("active");
            $(el).removeClass("side-comment-close");
            $("p#"+v+" .side-comment .comment-wrapper").css("display","block");
        }).on('hide',function(){
            $(this).attr("clicking",false).removeClass("active").css("display",commentStats[v]===0? "none":"block");
            $(el).addClass("side-comment-close");
            $("p#"+v+" .side-comment .comment-wrapper").css("display","none");
            removeAllEdit(v);
        });
        $(el).find("p#"+v).hover(function(){
            $(el).find("p#"+v+" .side-comment>a").css("display","block");
        },function(){
            if($(el).find("p#"+v+" .side-comment>a").attr("clicking")==="false")
                $(el).find("p#"+v+" .side-comment>a").css("display",commentStats[v]===0? "none":"block");
        })
    });
    $(el).css("transition","all .22s ease")
    .css("-webkit-transition","all .22s ease").click(function(e){
        if($(e.target).parent(el).length)
            $(el).find("p .side-comment>a.active").trigger("hide");
    });
    $(".side-comment .add-comment").click(function(e){
        e.stopPropagation();
        handleInsert(this);
    });

    var removeAllEdit= function(v){
        $("p#"+v+" .side-comment .edit").remove();
        if(!$("p#"+v+" .side-comment .add-comment").length){
            $(el).find("p#"+v+" .side-comment .comments").append('<a class="add-comment">Leave a Comment</a>');
            $("p#"+v+" .side-comment .add-comment").click(function(e){
                e.stopPropagation();
                handleInsert(this);
            })
        }
    }
    var handleInsert = function(elem){
        if(!currentUser)
            $(_this).trigger("notLogin");
        else{
            var $editArea = $(`<li class="edit">
                <div class="avatar"><img height="32" width="32" src="`+ currentUser.avatar+`"></div>
                <span class="name">`+ currentUser.name +`</span>
                <input type="text" placeholder="Leave a Comment..." class="edit-comment">
                <a class="reply-comment">Post</a>
                <a class="cancel">Cancel</a>
            </li>`);
            var $ul,$add,parent=0;
            if($(elem).hasClass("add-comment")){
                $ul = $(elem).parent();
                $add = elem;
            }else{
                $ul = $(elem).parent().parent();
                $($ul).find(".edit").remove();
                parent = $(elem).parent().attr("data-comment-id");
                $add = $($ul).find(".add-comment").length==0? $('<a class="add-comment">Leave a Comment</a>'):$($ul).find(".add-comment");
                var id = $(elem).parent().find(".number").text().substring(1);
                var $name = $($editArea).find(".name");
                $(`<span class="date reply">Reply To `+ id +`: </span>`).css("float","left").insertAfter($name);
            }
            $($add).remove();
            $($ul).append($editArea);
            $($editArea).find(".cancel").click(function(e){
                e.stopPropagation();
                $($editArea).remove();
                $($ul).append($add);
                $($add).click(function(e){
                    e.stopPropagation();
                    handleInsert(this);
                });
            });
            $($editArea).find(".reply-comment").click(function(e){
                e.stopPropagation();
                var payload = {
                    user:currentUser,
                    parent:parent? parent:"null",
                    postId:postId,
                    section: $($ul).parent().parent().parent().attr("id"),
                    body:encodeURI($($editArea).find(".edit-comment").val().replace(/<.*?>/g,""))
                }
                $(_this).trigger("postComment",payload);
                $($editArea).remove();
                $($ul).append($add);
                $($add).click(function(e){
                    e.stopPropagation();
                    handleInsert(this);
                });
            })
        }
    }
    this.handleInsert = handleInsert;
    this.commentStats = commentStats;
    this.handleComment = handleComment;
    this.insertCommentIntoSection = function(section,comment){
        $(el).find("p#"+section+" .side-comment>a span").text(commentStats[section]);
        $(el).find("p#"+section+" .side-comment>a").css("display","block");
        handleComment(comment);
        $add = $(el).find("p#"+section+" .side-comment .comments .add-comment");
        $add.remove();
        $(el).find("p#"+section+" .side-comment .comments").append($add);
        $($add).click(function(e){
            e.stopPropagation();
            handleInsert(this);
        });
    }
}
SideComment.prototype.insertComment = function(comment){
    this.comments.push(comment);
    this.commentStats[comment.section]++;
    this.insertCommentIntoSection(comment.section,comment);
}