// ================== script.js ==================

// Grab DOM elements safely
const loginModalEl = document.getElementById('Wajid');
const loginForm = loginModalEl?.querySelector('form');
const loginModal = loginModalEl ? new bootstrap.Modal(loginModalEl) : null;

const loginBtn = document.querySelector('button[data-bs-target="#Wajid"]');
const signupBtn = document.querySelector('button.btn-outline-primary');
const navContainer = document.querySelector('.d-flex.align-items-center');

const profileUpdateModalEl = document.getElementById('profileUpdateModal');
const profileUpdateModal = profileUpdateModalEl ? new bootstrap.Modal(profileUpdateModalEl) : null;
const updateProfileForm = document.getElementById('updateProfileForm');
const updateFirstName = document.getElementById('updateFirstName');
const updateLastName = document.getElementById('updateLastName');
const updatePassword = document.getElementById('updatePassword');
const updateReason = document.getElementById('updateReason');
const updatePhoto = document.getElementById('updatePhoto');

// ================= Helper Functions =================

// Random color for avatar
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
    return color;
}

// Convert uploaded file to Base64
function fileToBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
}

// ================= Display User in Navbar =================
function displayUser(user) {
    if (!navContainer) return;

    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';

    // Remove old elements
    document.querySelectorAll('.user-avatar, .user-name-btn, .user-detail-box').forEach(el => el.remove());

    // Avatar
    const avatar = document.createElement('div');
    avatar.classList.add('user-avatar');
    avatar.style.width = '40px';
    avatar.style.height = '40px';
    avatar.style.borderRadius = '50%';
    avatar.style.display = 'flex';
    avatar.style.justifyContent = 'center';
    avatar.style.alignItems = 'center';
    avatar.style.fontWeight = 'bold';
    avatar.style.fontSize = '18px';
    avatar.style.cursor = 'pointer';
    avatar.title = `${user.firstName} ${user.lastName}`;
    avatar.style.flexShrink = '0';

    if (user.photo) {
        avatar.style.backgroundImage = `url(${user.photo})`;
        avatar.style.backgroundSize = 'cover';
        avatar.style.backgroundPosition = 'center';
        avatar.style.backgroundRepeat = 'no-repeat';
        avatar.textContent = '';
    } else {
        avatar.style.backgroundColor = getRandomColor();
        avatar.style.color = 'white';
        avatar.textContent = user.firstName.charAt(0).toUpperCase();
    }

    // Name button
    const nameBtn = document.createElement('button');
    nameBtn.textContent = `${user.firstName} ${user.lastName}`;
    nameBtn.classList.add('user-name-btn');
    nameBtn.style.fontWeight = 'bold';
    nameBtn.style.fontSize = '16px';
    nameBtn.style.cursor = 'pointer';
    nameBtn.style.border = 'none';
    nameBtn.style.background = 'none';
    nameBtn.style.color = '#fff';
    nameBtn.style.marginLeft = '10px';
    nameBtn.style.padding = '5px 10px';
    nameBtn.style.borderRadius = '8px';
    nameBtn.style.transition = '0.3s';
    nameBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';

    nameBtn.addEventListener('mouseenter', () => nameBtn.style.background = 'rgba(255,255,255,0.1)');
    nameBtn.addEventListener('mouseleave', () => nameBtn.style.background = 'none');

    // Detail Box
    const detailBox = document.createElement('div');
    detailBox.classList.add('user-detail-box');
    detailBox.style.position = 'absolute';
    detailBox.style.top = '55px';
    detailBox.style.right = '10px';
    detailBox.style.background = '#2c2c2c';
    detailBox.style.color = 'white';
    detailBox.style.borderRadius = '10px';
    detailBox.style.padding = '15px';
    detailBox.style.display = 'none';
    detailBox.style.minWidth = '260px';
    detailBox.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    detailBox.style.fontSize = '14px';
    detailBox.style.lineHeight = '1.4';
    detailBox.innerHTML = `
        ${user.photo ? `<img src="${user.photo}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;margin-bottom:10px;display:block;">` : ''}
        <div><strong>Name:</strong> ${user.firstName} ${user.lastName}</div>
        <div><strong>Email:</strong> ${user.email}</div>
        <div><strong>Gender:</strong> ${user.gender}</div>
        <div><strong>Reason:</strong> ${user.reason}</div>
        <button id="editProfileBtn" class="btn btn-sm btn-warning mt-2 w-100">Edit Info</button>
        <button id="logoutBtn" class="btn btn-sm btn-danger mt-2 w-100">Logout</button>
    `;
    document.body.appendChild(detailBox);

    // Toggle detail box
    nameBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        detailBox.style.display = detailBox.style.display === 'none' ? 'block' : 'none';
    });

    // Hide when clicking outside
    document.addEventListener('click', (e) => {
        if (!detailBox.contains(e.target) && e.target !== nameBtn) {
            detailBox.style.display = 'none';
        }
    });

    // Edit Profile
    detailBox.querySelector('#editProfileBtn')?.addEventListener('click', () => {
        updateFirstName.value = user.firstName;
        updateLastName.value = user.lastName;
        updatePassword.value = '';
        updateReason.value = user.reason;
        updatePhoto.value = '';
        profileUpdateModal?.show();
    });

    // Logout
    detailBox.querySelector('#logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem('songhubbUser');
        avatar.remove();
        nameBtn.remove();
        detailBox.remove();
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (signupBtn) signupBtn.style.display = 'inline-block';
    });

    // Append to navbar
    navContainer.appendChild(avatar);
    navContainer.appendChild(nameBtn);

    // Profile Update Form Submit
    if (updateProfileForm) {
        updateProfileForm.onsubmit = (e) => {
            e.preventDefault();
            user.firstName = updateFirstName.value.trim();
            user.lastName = updateLastName.value.trim();
            if (updatePassword.value) user.password = updatePassword.value;
            user.reason = updateReason.value.trim();

            if (updatePhoto.files.length > 0) {
                fileToBase64(updatePhoto.files[0], (base64) => {
                    user.photo = base64;
                    saveAndRefresh();
                });
            } else {
                saveAndRefresh();
            }

            function saveAndRefresh() {
                localStorage.setItem('songhubbUser', JSON.stringify(user));
                profileUpdateModal?.hide();
                displayUser(user);
            }
        };
    }
}

// ================= On Page Load =================
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = JSON.parse(localStorage.getItem('songhubbUser'));
    if (savedUser && navContainer) displayUser(savedUser);
});

// ================= Login Form Submit =================
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const firstName = loginForm.querySelector('input[placeholder="First Name"]').value.trim();
        const lastName = loginForm.querySelector('input[placeholder="Last Name"]').value.trim();
        const email = loginForm.querySelector('#inputEmail').value.trim();
        const password = loginForm.querySelector('#inputPassword').value.trim();
        const confirmPassword = loginForm.querySelector('#inputConfirmPassword').value.trim();
        const gender = loginForm.querySelector('input[name="gender"]:checked')?.value || '';
        const reason = loginForm.querySelector('#inputZip').value.trim();

        if (!firstName || !lastName || !email || !password || !confirmPassword || !gender) {
            return alert('Please fill all required fields!');
        }
        if (password !== confirmPassword) return alert('Passwords do not match!');

        const user = { firstName, lastName, email, password, gender, reason, photo: null };
        localStorage.setItem('songhubbUser', JSON.stringify(user));
        loginModal?.hide();
        displayUser(user);
        loginForm.reset();
    });
}
