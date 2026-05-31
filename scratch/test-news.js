const apiKey = "cdd52a365a664a4ca542a35327154b6e";
const category = "technology";

async function test() {
  const data = await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&country=us&apiKey=${apiKey}`, {
    headers: { 'User-Agent': 'PayForAPI/1.0' }
  });
  const res = await data.json();
  console.log(JSON.stringify(res, null, 2));
}

test();
