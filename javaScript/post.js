
// get post id 
const URLIdPrams = new URLSearchParams(window.location.search);

const postId= URLIdPrams.get('postId');

//get post url from api


if(!postId)  alert("there is no post ");

const urlToGetPost = `https://tarmeezacademy.com/api/v1/posts/${postId}`;
//comment content
let postComments = [];

const postContainer = document.getElementById("post-container");

getPost();
// get post 
async function getPost() {
    showLoader(postContainer)
    try{
        let response = await fetch(urlToGetPost);
        
        if(!response.ok) throw new Error(`http errors ${response.status}`);

        const data = await response.json();

        const post =data.data;

        createPost(post);


    }catch(error){
        const message = `Registration failed + ${error.message}`;
        alertMessage(message,"danger")
    }finally{
        hideLoader()
    }
}


function createPost(post){

    //post Body
    const postTitle =post.title == null ? "":post.title;
    const postBody = post.body || "";
    const hasBodyImg = post.image && typeof post.image === "string";
    //author information
    const author = post.author;
    const authorImg = author.profile_image && typeof author.profile_image ==="string" ? author.profile_image : "./images/3551739.jpg";
    const authorUserName= author.username?author.username : "user";
    //post timing
    const timeAgo = post.created_at;
    // comment count
    const commentsCount = post.comments_count;

    // get commments
    postComments =post.comments;
    

    //the name of users
    const usernameShow = document.querySelector(".main-content .username span");
    if(usernameShow) usernameShow.innerHTML=authorUserName ;

    // the content of post
    let content =`
    <div id="post" class="post card shadow col-8">
                <div class="card-header ">
                    <img class="border border-3 rounded-circle img" src=${authorImg} alt="Person img">
                    <p class="d-inline-block fs-6 fw-bold">${authorUserName}</p>
                </div>
                <div class="card-body">
                    ${ hasBodyImg ? `<img src="${post.image}" alt="User profile picture" style="max-width:100%;border-radius: 8px; ">` :""}
                    <p class="fs-6 text-black-50 mt-1 ps-1 mb-1">${timeAgo}</p>
                    <h3 class="fs-6 ps-1">${postTitle}</h3>
                    <p class="post-content ps-1">${postBody}</p>
                    <div class="comment p-1" style="cursor:pointer" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16">
                        <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
                        </svg>
                        <span>
                            (${commentsCount}) Comments
                        </span>                        
                    </div>
                </div>
                <div class="comment-container" ></div>
            </div>
    
    `;

    
    postContainer.innerHTML = content;

    //click the comment
    const commmentBtn= document.querySelector(".comment");
    commmentBtn.addEventListener("click",()=>{
        showComments(postComments)
    })

}




// show commments of the post

function showComments(comments){
    const container = document.querySelector(".comment-container");
    container.innerHTML="";
    comments.forEach(comment => {
        const commentAuthorImg = comment.author.profile_image && typeof comment.author.profile_image === "string" 
            ? comment.author.profile_image 
            : "./images/3551739.jpg";
        const commentAuthorUsername = comment.author.username || "user"
        container.innerHTML += `
        <div class=" p-3 mt-2">
            <div class="user-info">
                <img src="${commentAuthorImg}" style="width:30px;height:30px; border-radius:50%" >
                <span class="fw-bold ">${commentAuthorUsername}</span>
            </div>
            <div class="comment-body p-2">
                ${comment.body}
            </div>
        </div>
        `;
    
    });
    // check if there is logging
    const token = localStorage.getItem("token");
    if(!token) return;

    container.innerHTML +=`
        <div class="m-3 p-relative" >
            <input type="text" id="comment-input" class="comment-input" placeholder="Add Your Comment Here.." >
            <button class="comment-submit" type="button">Send</button>
        </div>
    `;

    const commentValue= document.getElementById('comment-input') ;

    document.querySelector(".comment-submit").addEventListener("click",()=>{
        createComment(commentValue.value)
    })
}

const urlCreateComment=`https://tarmeezacademy.com/api/v1/posts/${postId}/comments`

//create comment
async function createComment(commentValue){

    const token = localStorage.getItem('token');
    // check if the comment is empety
    if (commentValue === "") {
        alert("Comment cannot be empty");
        return;
    }

    // check if there is logging
    if (!token) {
        alert("Please log in to add a comment");
        return;
    }
    
    try{
        let response= await fetch(urlCreateComment,{
            method:"POST",
            body: JSON.stringify({"body": commentValue}),
            headers:{
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }

        });

        if(!response.ok) throw new Error(`http${response.status}`)
        
        await getPost()

    }catch(error){
        alert('There is an error' + error)
        
    }
}