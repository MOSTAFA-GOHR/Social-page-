//get author id from post


let authorId="";
const urlParam = new URLSearchParams(window.location.search);
    authorId = urlParam.get("authorId");





if(!authorId || authorId == null){
    let user = JSON.parse(localStorage.getItem("user"))
    authorId = user.id;
}


getUserInformation();
async function getUserInformation(){

    
    const urlUserInfo =`https://tarmeezacademy.com/api/v1/users/${authorId}`
    try{
        let response = await fetch(urlUserInfo,{
            method:"GET",
        });

        if(!response.ok) throw new Error(`HTTP Error ! status : ${response.status}`);
        let data = await response.json();

        const user = data.data;
        
        userFillProfile(user)
        userPosts()

    }catch(error){
        const message = `There is an error ${error}`;
        alertMessage(message, "danger");
    }
};

function userFillProfile(user){
   
    const username = user.username;
    const name = user.name;
    const email = user.email;
    const commentsCount = user.comments_count;
    const postsCount = user.posts_count;
    const image = user.profile_image && typeof user.profile_image === "string"
        ? user.profile_image
        : "./images/3551739.jpg";


    document.getElementById("username-profile").textContent=username;
    document.getElementById("email-profile").textContent=email;
    document.getElementById("name-profile").textContent=name;
    document.getElementById("profile-users-Posts").textContent=`${username}'s Posts`;
    
    document.getElementById("post-count-num").textContent =postsCount;
    document.getElementById("comment-count-num").textContent =commentsCount;
    let img = document.getElementById("img-profile");
    img.src=`${image}`
};

async function userPosts(){
    const urlUserInfo =`https://tarmeezacademy.com/api/v1/users/${authorId}/posts`
    try{
        let response = await fetch(urlUserInfo,{
            method:"GET",
        });

        if(!response.ok) throw new Error(`HTTP Error ! status : ${response.status}`);
        let data = await response.json();
        let posts=data.data;
    
        addUserPosts(posts)

    }catch(error){
        const message = `There is an error ${error}`;
        alertMessage(message, "danger");
    }
};


function addUserPosts(posts){

    const postsContainer = document.getElementById("user-posts");
    postsContainer.innerHTML="";


    posts.forEach(post => {
        


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
        const postId = post.id
        //check if show update button
        let user = JSON.parse(localStorage.getItem("user"));

        let userId= user.id;

        



        const postContent =`
            <div id="post" class="post card shadow col-8">
                <div class="card-header ">
                    <img class="border border-3 rounded-circle img" src=${authorImg}  alt="Person img">
                    <p class="d-inline-block fs-6 fw-bold">${authorUserName}</p>

                    ${(userId == author.id && user != null)? `<button type="button" class="btn btn-primary" style="float:right" onclick="updatePost('${encodeURIComponent(JSON.stringify(post))}')">Update</button>`:""}
                    ${(userId == author.id && user != null)? `<button type="button" class="btn btn-danger me-2 " style="float:right" onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>`:""}
                </div>
                <div class="card-body" onclick ="postClicked(${postId})" style="cursor:pointer">
                    ${ hasBodyImg ? `<img src="${post.image}" style="max-width:100%" alt="User profile picture">` :""}
                    <p class="fs-6 text-black-50 mt-1 ps-1 mb-1">${timeAgo}</p>
                    <h3 class="fs-6 ps-1">${postTitle}</h3>
                    <p class="post-content ps-1">${postBody}</p>
                    <div class="comment p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16">
                        <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
                        </svg>
                        <span>
                            (${commentsCount}) Comments
                        </span>                        
                    </div>
                </div>
            </div>`


        postsContainer.innerHTML += postContent;
    });
    
}


