// Load last ID from localStorage or start with 1 if not set
var id: number = parseInt(localStorage.getItem('lastFetchedId') || '1', 10);

interface Post {
    id: number;
    title: string;
    body: string;
}

let removed: Array<Post> = JSON.parse(localStorage.getItem('removedPosts') || '[]');
let allPosts: Array<Post> = JSON.parse(localStorage.getItem('allPosts') || '[]');  
let isShowingDeleted: boolean = false;

window.addEventListener('load', () => {
    if (allPosts.length > 0) {
        allPosts.forEach((post) => {
            addDataToPage(post);
        });
    }
});

let fetchbtn = document.getElementById('fetch-btn') as HTMLButtonElement;
fetchbtn?.addEventListener('click', () => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .then((response) => response.json())
        .then((data) => {
            addDataToPage(data);
            allPosts.push(data); 
            localStorage.setItem('allPosts', JSON.stringify(allPosts));
            localStorage.setItem('lastFetchedId', (id++).toString()); // Increment and store new ID
        })
        .catch((error) => {
            console.log(error);
        });
});

function addDataToPage(data: Post) {
    const addData = document.getElementById('data') as HTMLElement;
    const elementToAdd = document.createElement('div');
    elementToAdd.className = 'box';
    elementToAdd.innerHTML = `
        <button class="delete-btn" onclick="openModal(this.parentElement)">&#10006</button>
        <h2>${data.title}</h2>
        <p>${data.body}</p>
    `;
    addData?.appendChild(elementToAdd);

    elementToAdd.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

function deletePost(element: HTMLElement) {
    const title = element.querySelector('h2')?.textContent || '';
    const body = element.querySelector('p')?.textContent || '';

    removed.push({ id, title, body });
    localStorage.setItem('removedPosts', JSON.stringify(removed));

    allPosts = allPosts.filter(post => post.title !== title || post.body !== body);
    localStorage.setItem('allPosts', JSON.stringify(allPosts));

    element.remove();
}

function deletePostPermanently(element: HTMLElement) {
    const title = element.querySelector('h2')?.textContent || '';
    removed = removed.filter(post => post.title !== title);
    localStorage.setItem('removedPosts', JSON.stringify(removed));
    element.remove();
}

let modal = document.getElementById("myModal") as HTMLElement;
let selectedTaskToDelete: HTMLElement;

function openModal(task: HTMLElement) {
    modal.style.display = "block";
    selectedTaskToDelete = task;
}

let closeSpan = document.getElementsByClassName("close")[0] as HTMLElement;
closeSpan.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event: any) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

let okButton = document.getElementsByClassName("ok")[0] as HTMLButtonElement;
okButton.onclick = function () {
    if (isShowingDeleted) {
        deletePostPermanently(selectedTaskToDelete);
    } else {
        deletePost(selectedTaskToDelete); 
    }
    modal.style.display = "none";
};

let deletedPostButton = document.getElementById('bin') as HTMLButtonElement;
deletedPostButton?.addEventListener('click', toggleDeletedData);

function toggleDeletedData() {
    const addData = document.getElementById('data') as HTMLElement;
    const deletedData = document.getElementById('deleted-data') as HTMLElement;
    const fetchbtn = document.getElementById('fetch-btn') as HTMLElement;

    if (!isShowingDeleted) {
        // Show deleted posts, hide fetch button, and add Close button
        deletedData.innerHTML = `<h2 class="subheading">Deleted Data</h2>`;
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.className = 'close-deleted';
        closeButton.onclick = toggleDeletedData;

        removed.forEach((post) => {
            const elementToAdd = document.createElement('div');
            elementToAdd.className = 'box';
            elementToAdd.innerHTML = `
                <button class="delete-btn" onclick="openModal(this.parentElement)">&#10006</button>
                <h2>${post.title}</h2>
                <p>${post.body}</p>
            `;
            deletedData?.appendChild(elementToAdd);
        });

        deletedData.style.display = 'flex';
        addData.style.display = 'none';
        fetchbtn.style.display = 'none';
        deletedPostButton.style.display = 'none';
        deletedData.appendChild(closeButton); // Add Close button to deletedData container
    } else {
        // Show all posts and make fetch button visible
        deletedData.style.display = 'none';
        addData.style.display = 'flex';
        fetchbtn.style.display = 'block';
        deletedPostButton.style.display = 'block';
        deletedData.innerHTML = ''; // Clear deletedData to remove old elements
    }
    isShowingDeleted = !isShowingDeleted;
}
