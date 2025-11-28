Parse.initialize("fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP", "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb");
Parse.serverURL = "https://parseapi.back4app.com/";


document.getElementById("runFix").addEventListener("click", async () => {
    const currentUser = Parse.User.current();
    if (!currentUser) {
        output.textContent = "❌ Not logged in.";
        return;
    }

    output.textContent = "🔧 Running cloud fix...";

    try {
        const result = await Parse.Cloud.run("fixOldFeedbackACLs");
        output.textContent = result;
    } catch (err) {
        console.error(err);
        output.textContent = `❌ Error: ${err.message}`;
    }
});
