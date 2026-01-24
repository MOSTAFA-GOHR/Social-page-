
// check if there is a user
if(localStorage.getItem("token")) {
    updateUI();
    //add name and image profile
    addNameOfUser();
}


// infinite scrolling//////////////

let currentPage = 1;
let lastPage = 1;
let isLoading=false;

window.addEventListener("scroll",()=> {
    const endOfPage=window.innerHeight + window.pageYOffset >= document.body.scrollHeight;

    if(endOfPage && !isLoading && currentPage < lastPage){
        currentPage +=1;
        getPosts(false,currentPage);
    }
})




let postsContainer = document.getElementById("posts");

async function getPosts(first = true,page){
    const urlPosts =`https://tarmeezacademy.com/api/v1/posts?limit=5&page=${page}`

    isLoading=true;
    
    showLoader(postsContainer)

    try{
        const response = await fetch(urlPosts);
        if(!response.ok) throw new Error(`http${response.status}`);
        const data = await response.json();
        let posts = data.data;
        createPost(posts,first);

        lastPage = data.meta.last_page;
    }
    catch(error){
        const message = `Fetching posts failed: ${error.message}`;
        alertMessage(message, "danger");
    }finally{
        hideLoader()
        isLoading=false;
    }
}

//loading feedback

function showLoader(container) {
    if (!document.getElementById("loader")) {
        container.insertAdjacentHTML(
            "beforeend",
            `<p id="loader" class="loading">Loading posts...</p>`
        );
    }
}
function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.remove();
}

function createPost(posts,first = true){

    if(first) postsContainer.innerHTML="";


    posts.forEach(post => {
        


        //post Body
        const postTitle =post.title == null ? "":post.title;
        const postBody = post.body || "";
        const hasBodyImg = post.image && typeof post.image === "string";
        //author information
        const author = post.author;
        const authorImg = author.profile_image && typeof author.profile_image ==="string" ? author.profile_image : "./images/3551739.jpg";
        const authorUserName= author.username?author.username : "user";
        const authorId =author.id;;
        //post timing
        const timeAgo = post.created_at;
        // comment count
        const commentsCount = post.comments_count;
        const postId = post.id
        //check if show update button
        let userId;
        let user = JSON.parse(localStorage.getItem("user"));

        if( user) userId =user.id

        



        const postContent =`
            <div id="post" class="post card shadow col-8">
                <div class="card-header ">
                    <div style="display: inline; cursor:pointer;" onclick="showUserProfile(${authorId})">
                        <img class="border border-3 rounded-circle img" src=${authorImg}  alt="Person img">
                        <p class="d-inline-block fs-6 fw-bold">${authorUserName}</p>
                    </div>
                    ${(userId == author.id && user != null)? `<button type="button" class="btn btn-primary" style="float:right" onclick="updatePost('${encodeURIComponent(JSON.stringify(post))}')">Update</button>`:""}
                    ${(userId == author.id && user != null)? `<button type="button" class="btn btn-danger me-2 " style="float:right" onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>`:""}
                </div>
                <div class="card-body" onclick ="postClicked(${postId})" style="cursor:pointer">
                    ${ hasBodyImg ? `<img src="${post.image}" alt="User profile picture">` :""}
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




getPosts()

//////////////////////////////////////////////
//Make Login Code
let loginButton= document.getElementById("log-in");

const loginUrl = "https://tarmeezacademy.com/api/v1/login";

loginButton.addEventListener("click",()=>{
    getLogin()
});



async function getLogin() {
    let usernameInput = document.getElementById("recipient-name");
    let passwordInput = document.getElementById("password");

    if(!usernameInput.value || !passwordInput.value) {
        alert("Please Enter your Username or Password");
        return;
    }

    const dataToSend = {
        username:usernameInput.value,
        password:passwordInput.value,
    }
    
    try{
        let response = await fetch(loginUrl, {
            method:"post",
            headers:{
                "Content-Type":"application/json",
                },
            body:JSON.stringify(dataToSend),
            });
        
        if(!response.ok) throw new Error(`HTTP error: ${response.status}`)

        const data = await response.json();
        const token =data.token;
    
        if(token){
            const user =JSON.stringify(data.user);
            localStorage.setItem("token",token);
            localStorage.setItem("user",user);
            // hidden the password
            passwordInput.value="";

            const modalOfLogin = document.getElementById("exampleModal");
            const modalInstance = bootstrap.Modal.getInstance(modalOfLogin);
            modalInstance.hide();
            //updat button 
            alertMessage("Logged In Successfully")
            updateUI()
             //add name and image profile
            addNameOfUser();
        }
    }catch(error){
        const message = `Login failed: ${error}`;
        alertMessage(message, "danger");
        
    }
}

///////////////////////// Make Register
const registerButton = document.getElementById("register");
const registerUrl = "https://tarmeezacademy.com/api/v1/register";

registerButton.addEventListener("click",()=>{
    getRegister()
})

async function getRegister(){
    const username =document.getElementById("register-username").value.trim();
    const name = document.getElementById("register-name").value.trim();
    const email =document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();
    const picture = document.getElementById("register-image").files[0];

    
    if(!email||!name||!password||!username){
        alert("Please Enter your Username or Password");
        return;
    };
    

    const formData = new FormData();
    formData.append("username",username);
    formData.append("password",password);
    if(picture) formData.append("image",picture);
    formData.append("name",name);
    formData.append("email",email);

    
    
    try{
        const response = await fetch(registerUrl,{
            method:"post",
            body: formData,
        });
        
        const data = await response.json();


        if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);


        const token =  data.token;


        if(token){
            localStorage.setItem("token",token);
            const user = JSON.stringify( data.user);
            localStorage.setItem("user",user);

            
            document.getElementById("register-username").value="";
            document.getElementById("register-name").value="";
            document.getElementById("register-email").value="";
            document.getElementById("register-password").value="";

            const modalOfRegister = document.getElementById("exampleModalRegister");
            const modalInstance = bootstrap.Modal.getInstance(modalOfRegister);
            modalInstance.hide();
            //updat button 
            alertMessage("Registration Successfully");
            updateUI();
             //add name and image profile
            addNameOfUser();
        };

    }catch(error){
        const message = `Registration failed : ${error.message}`;
        alertMessage(message, "danger");
    }

};


/////////////////////// after login || after registration/////////////
// alert message
function alertMessage(text,typeColor="success"){
    let alertPlaceholder = document.getElementById("liveAlertPlaceholder");
    const appendAlert = (message, type) => {

        alertPlaceholder.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        
    }
    appendAlert(`${text}`, typeColor);


    setTimeout(()=>{
        const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder');
        alert.close();
    },2000)
    
};

// update the button 



function updateUI(){
    const loginButton = document.getElementById("log-in-main");
    const registerButton =document.getElementById("register-main");
    const logoutButton = document.getElementById("log-out");
    const addPost = document.getElementById("adding-post");


    loginButton.classList.add("hidden");
    registerButton.classList.add("hidden");
    logoutButton.classList.remove("hidden");
    if(addPost) addPost.classList.remove("hidden");
    

    // Making post
    document.getElementById("create-post").addEventListener("click",()=>{
        newPost();
    });


    //click on log out button
    logoutButton.addEventListener("click",()=>{
        alertMessage("Logged Out successfully");
        loginButton.classList.remove("hidden");
        registerButton.classList.remove("hidden");
        logoutButton.classList.add("hidden");
        if(addPost) addPost.classList.add("hidden");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        location.reload()
    });

};


// adding the name of user and his picture
function addNameOfUser(){
    let container = document.getElementById("user-info");
    let user= null;
    if(localStorage.getItem("user") != null){
        user = JSON.parse(localStorage.getItem("user"));
    }
    let username = user.username;
    const image = user.profile_image && typeof user.profile_image === "string"
        ? user.profile_image
        : "./images/3551739.jpg";

    const content = `
        <div class="d-flex justify-content-center align-items-center flex-row-reverse gap-2  ms-2">
            <h3 class="fs-5 m-0" >${username}</h3>
            <img class="border border-3 rounded-circle img" style="width: 25px; height: 25px;" src=${image}  alt="Person img">
        </div>
    `;
    container.innerHTML="";
    container.innerHTML +=content;
};

////////////////////////////////////// adding post


async function newPost(){

    //check if the post is update or new create new post
    let postCheckId = document.getElementById("post-check-id").value;

    let isNew = postCheckId == null || postCheckId == "";

    let  urlPost = "";


    const title = document.getElementById("post-title").value;
    const bodyPost = document.getElementById("post-body").value;
    const bodyImage = document.getElementById("post-image").files[0];

    const formData = new FormData()

    formData.append("title",title);
    formData.append("body",bodyPost);
    if(bodyImage) formData.append("image",bodyImage);

    const token = localStorage.getItem("token");
    
    //send new post
    try{
        if(isNew){
        urlPost = "https://tarmeezacademy.com/api/v1/posts";

        }else{
            urlPost = `https://tarmeezacademy.com/api/v1/posts/${postCheckId}`;
            formData.append("_method","PUT");
        }

        
            const response= await fetch(urlPost,
                {
                    method:"POST",
                    body:formData,
                    headers:{
                        "authorization":`Bearer ${token}`
                    }
                }
            );

            if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            const postModal = document.getElementById("exampleModalPost");
            const modalInstance = bootstrap.Modal.getInstance(postModal);
            modalInstance.hide();

            alertMessage("The Post Has Been Created");
            // Update post content
            getPosts(true,1)
    }catch(error){
        const message = `Create post failed: ${error.message}`;
        alertMessage(message, "danger");
        
    }
}

// show Post

function postClicked(postId){
    window.location.href=`post-info.html?postId=${postId}`;
}

//update Post
function updatePost(post){
    let postObj = JSON.parse(decodeURIComponent(post));
    
    document.getElementById("post-check-id").value=postObj.id;
    document.getElementById("post-title-modal").innerHTML="Update Your Post";
    
    document.getElementById("create-post").innerHTML="Update";
    document.getElementById("post-title").value=postObj.title;
    document.getElementById("post-body").value=postObj.body;

    let updatModal = new bootstrap.Modal(document.getElementById("exampleModalPost"),{});
    updatModal.toggle();

    
}
//adding new post
const addPost = document.getElementById("adding-post");
addPost.addEventListener("click",()=>{
    addNewPost()
})

function addNewPost(){
    document.getElementById("post-title-modal").innerHTML="Create New Post";
    document.getElementById("post-check-id").value="";
    document.getElementById("create-post").innerHTML="create";
        document.getElementById("post-title").value="";
    document.getElementById("post-body").value="";

    let createPost = new bootstrap.Modal(document.getElementById("exampleModalPost"),{});
    createPost.toggle();
};

//delete post
function deletePost(post){
    let postObj = JSON.parse(decodeURIComponent(post));

    let deleteModal = new bootstrap.Modal(document.getElementById("exampleModalDeletePost"),{});
    deleteModal.toggle();

    document.getElementById("delete-post").addEventListener("click",()=>{
        deletePostConfirm(postObj.id)
    })
}


async function deletePostConfirm(postId){
    const deleteUrl =`https://tarmeezacademy.com/api/v1/posts/${postId}`;
    const token = localStorage.getItem("token");
    if (!postId || !token) {
    alertMessage("Invalid post ID or missing token", "danger");
    return;
    };
    

    if (!token) {
        alertMessage("Please log in to delete posts", "danger");
        return;
    }

    try{
        const response = await fetch(deleteUrl, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        alertMessage("deleting is successfully","success");

        const deletePostModal = document.getElementById("exampleModalDeletePost");
        const modalInstance = bootstrap.Modal.getInstance(deletePostModal);
        modalInstance.hide();

        getPosts(true,1);
    }catch(error){
        const message = `Create post failed: ${error}`;
        alertMessage(message, "danger");
    }
};

//show user Profile
function showUserProfile(authorId){
    window.location.href=`profile.html?authorId=${authorId}`;
    
}