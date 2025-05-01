// functions/index.js (v1 Callable Function 사용)
const functions = require("firebase-functions");
const admin     = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
/**
 * 
 * 
 * 
 * 
 * rateLimited: 분당 60회 호출 제한 적용된 Callable Function
 */
exports.rateLimited = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "로그인이 필요합니다."
    );
  }

  const uid = context.auth.uid;
  const ref = admin.firestore().collection("rateLimits").doc(uid);
  const snap = await ref.get();
  const now = admin.firestore.Timestamp.now();

  // 1분(60초) 이내 60회 이상 호출 막기
  if (snap.exists) {
    const lastCall = snap.data().lastCall;
    const count    = snap.data().count || 0;
    if (now.seconds - lastCall.seconds < 60) {
      if (count >= 60) {
        throw new functions.https.HttpsError(
          "resource-exhausted",
          "분당 호출 한도를 초과했습니다."
        );
      }
      // 같은 1분 내 호출 증가
      await ref.update({
        lastCall: now,
        count: admin.firestore.FieldValue.increment(1)
      });
    } else {
      // 1분 경과 시 초기화
      await ref.set({ lastCall: now, count: 1 });
    }
  } else {
    // 첫 호출
    await ref.set({ lastCall: now, count: 1 });
  }

  // TODO: 실제 로직 (예: 조회수 증가 등) 삽입
  // await admin.firestore().collection('posts').doc(data.postId)
  //   .update({ views: admin.firestore.FieldValue.increment(1) });

  return { success: true };
});


// Callable Function: 클라이언트에서 호출해서 글을 씁니다.
exports.createPost = functions.https.onCall(async (data, context) => {
    // 1) 인증 확인

    console.log('▶ createPost 호출 – context.auth:', context.auth);
    
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "로그인이 필요합니다.");
    }
  
    const { title, content, attachments } = data;
  
    // 2) 길이 재검사
    if (typeof title !== "string" || title.trim().length === 0) {
        throw new functions.https.HttpsError("invalid-argument", "제목을 입력");
      }
      if (title.length > 100) {
        throw new functions.https.HttpsError("invalid-argument", `제목은 최대 100자 (현재 ${title.length}자)`);
      }
      if (typeof content !== "string" || content.trim().length === 0) {
        throw new functions.https.HttpsError("invalid-argument", "내용을 입력");
      }
      if (content.length > 2000) {
        throw new functions.https.HttpsError("invalid-argument", `내용은 최대 2000자 (현재 ${content.length}자)`);
      }
    if (!Array.isArray(attachments)) {
      throw new functions.https.HttpsError("invalid-argument", "잘못된 첨부파일 형식입니다.");
    }
  
    // 3) Firestore에 쓰기
    const docRef = await db.collection("posts").add({
      title:       title.trim(),
      content:     content.trim(),
      uid:         context.auth.uid,
      username:    context.auth.token.name,
      photoURL:    context.auth.token.picture,
      attachments: attachments,
      likes:       0,
      dislikes:    0,
      views:       0,
      commentCount:0,
      createdAt:   admin.firestore.FieldValue.serverTimestamp()
    });
  
    return { success: true, id: docRef.id };
  });