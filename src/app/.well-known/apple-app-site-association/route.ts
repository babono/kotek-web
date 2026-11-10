// A route, not a file in public/: iOS wants this served as JSON, and a file
// with no extension isn't.
export function GET() {
  return Response.json({
    applinks: {
      details: [
        {
          appIDs: ["235Y6894DR.com.dimas.gomelan", "U96VKD93X4.me.babono.kotek"],
          components: [{ "/": "/share/*" }],
        },
      ],
    },
  });
}
