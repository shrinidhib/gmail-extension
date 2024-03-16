function categorise(){
    const emails=document.querySelectorAll('.zA');
    console.log('here')
    emails.forEach(email=>{
        const subject = email.querySelector('.bog span').textContent;
        console.log(subject)

    
    let category;
    if (subject.includes('important')) {
      category = 'Important';
    } else if (subject.includes('promotion')) {
      category = 'Promotion';
    } else {
      category = 'Other';
    }

    // Create and append category label
    const categoryLabel = document.createElement('span');
    categoryLabel.textContent = `[${category}]`;
    categoryLabel.style.color = 'blue';
    categoryLabel.style.marginLeft = '5px';
    categoryLabel.classList=['new']
    email.querySelector('.y6 span').appendChild(categoryLabel);
    })
}




document.addEventListener('DOMContentLoaded', (e)=>{
    console.log('here1')
    categorise()});

window.addEventListener('load', (event) => {
        console.log('here2')
        categorise()
        // Call your content script injection function here
    });