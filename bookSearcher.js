function getBooks() {

    // Clears the flexbox div in case a second search is made and the div already has content within.
    document.getElementById("booksFlexDiv").innerHTML = "";

    // Inits an index counter for adding an index to the elements of each book.
    let counter = 0;

    // Gets search terms from the input, converts to lower case, splits by spaces and then joins with a +
    let processedInputQuery = document.getElementById("bookSearchInput").value.toLowerCase().split(" ").join("+");

    // Holds the books flexbox for ease of use.
    let booksDiv = document.getElementById("booksFlexDiv");

    // Fetches an API request with the processed input and handles the response.
    let bookCollection = fetch("https://www.googleapis.com/books/v1/volumes?q=" + processedInputQuery)
        .then(books => { return books.json() })
        .then(booksJson => { return booksJson.items })
        .then(books => {

            for (const book of books) {

                // Variable holding per-book information that we need for ease of use.
                let bookInformation = book.volumeInfo;

                // Creates initial div that will be the 'item' in the flexbox containing the books.
                // Each item = separate book
                let bookDiv = document.createElement("div");
                bookDiv.setAttribute("id", "book" + counter);
                bookDiv.setAttribute("class", "book");

                // Title handler. Takes the title, creates an h1 and adds it to the div.
                let titleHeader = document.createElement("h1");
                titleHeader.setAttribute("id", "title" + counter);
                titleHeader.innerHTML = bookInformation.title;
                bookDiv.appendChild(titleHeader);

                // Author handler. Checks if there are authors and joins them by ". " if there are multiple ones.
                // If an author is missing, it adds the publishers with the same logic
                // If both are missing, adds to the h3 that they are unknown.
                let authorHeader = document.createElement("h3");
                authorHeader.setAttribute("id", "author" + counter);
                if (bookInformation.authors) { authorHeader.innerHTML = bookInformation.authors.join(", "); }
                else if (bookInformation.publisher) { authorHeader.innerHTML = bookInformation.publisher; }
                else { authorHeader.innerHTML = "Unknown author/publisher." }
                bookDiv.appendChild(authorHeader);

                // Description handler. Checks if it has description and fills it. If its more than 500chars
                // It cuts it and adds "..." at the end. If description is missing, adds a text snippet.
                // If a text snippet is also misisng, fills the paragraph with "Missing description/text snippet";
                let descriptionParagraph = document.createElement("p");
                descriptionParagraph.setAttribute("id", "description" + counter);
                let bookDescription = "";
                // NOTE : Code is in try/catch because the API returns different results for every book. Catches end-cases.
                try {
                    if (bookInformation.description) {
                        bookDescription = "Description :" + JSON.stringify(bookInformation.description);
                        if (bookDescription.length > 500) {
                            bookDescription = "Description :" + bookDescription.substring(0, 498) + "...";
                        }
                    }
                    else if (book.searchInfo.textSnippet) { bookDescription = "Text snippet :" + JSON.stringify(book.searchInfo.textSnippet); }
                    else { bookDescription = "Missing description / text snippet.";}
                    descriptionParagraph.innerHTML = bookDescription;
                    bookDiv.appendChild(descriptionParagraph);
                } catch (error) {
                    bookDescription = "Missing description / text snippet.";
                    descriptionParagraph.innerHTML = bookDescription;
                    bookDiv.appendChild(descriptionParagraph);
                }

                // Cover image handler. Gets the image and appends it.
                // If the image is missing, it sets a default one from local files.
                const cover = new Image();
                cover.setAttribute("id", "image" + counter);
                if (bookInformation.imageLinks.thumbnail) { cover.src = bookInformation.imageLinks.thumbnail; }
                else {
                    cover.src = "img/nofile.png";
                    cover.setAttribute("width", "128px");
                    cover.setAttribute("height", "191px");
                }
                cover.setAttribute("alt", "Cover photo.");
                bookDiv.appendChild(cover);

                // Download button handler. Checks if a download link is available,
                // If it is, it adds a download icon with a hyperlink to the download.
                if (book.accessInfo.pdf.acsTokenLink) {
                    let anchor = document.createElement("a");
                    anchor.setAttribute("href", book.accessInfo.pdf.acsTokenLink);
                    anchor.setAttribute("id", "downloadAnchor" + counter);
                    let downloadImg = new Image();
                    downloadImg.setAttribute("id", "downloadbutton" + counter);
                    downloadImg.setAttribute("alt", "Download this eBook.");
                    downloadImg.setAttribute("width", "50px");
                    downloadImg.setAttribute("height", "50px");
                    downloadImg.setAttribute("margin", "20px");
                    downloadImg.src = "img/download.png"
                    anchor.appendChild(downloadImg);
                    bookDiv.appendChild(anchor);
                }

                // Appends the created book div (item) with the filled information for the current iterated book.
                document.getElementById("booksFlexDiv").appendChild(bookDiv);

                // Adds to the counter to keep track of the element indexes.
                counter++;
            }

            // Resets the counter if a new search is done.
            counter = 0;
        });
}