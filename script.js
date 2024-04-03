// JavaScript for testimonial carousel

let testimonialIndex = 0;
const testimonials = document.getElementsByClassName("testimonial");

// Display initial testimonial
showTestimonial(testimonialIndex);

// Auto change testimonials every 5 seconds
let testimonialInterval = setInterval(nextTestimonial, 5000);

// Function to display testimonial
function showTestimonial(index) {
    console.log("Showing testimonial at index: " + index);
    // Hide all testimonials
    for (let i = 0; i < testimonials.length; i++) {
        testimonials[i].style.display = "none";
    }
    
    // Show the testimonial at the given index
    testimonials[index].style.display = "block";
}

// Function to display next testimonial
function nextTestimonial() {
    console.log("Next testimonial");
    // Hide the current testimonial
    testimonials[testimonialIndex].style.display = "none";
    
    // Increment the testimonial index
    testimonialIndex++;
    
    // If the index exceeds the number of testimonials, set it back to 0
    if (testimonialIndex >= testimonials.length) {
        testimonialIndex = 0;
    }
    
    // Show the next testimonial
    testimonials[testimonialIndex].style.display = "block";
}

// Function to display previous testimonial
function prevTestimonial() {
    console.log("Previous testimonial");
    // Hide the current testimonial
    testimonials[testimonialIndex].style.display = "none";
    
    // Decrement the testimonial index
    testimonialIndex--;
    
    // If the index is less than 0, set it to the last testimonial index
    if (testimonialIndex < 0) {
        testimonialIndex = testimonials.length - 1;
    }
    
    // Show the previous testimonial
    testimonials[testimonialIndex].style.display = "block";
}
// JavaScript for testimonial carousel

function openImage(imageName) {
    window.open(imageName, '_blank');
}
