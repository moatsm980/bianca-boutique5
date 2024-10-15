using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class player : MonoBehaviour
{

    float Ho;
    public float speed = 0.05f;
    SpriteRenderer sr;
    Rigidbody2D rb;
    public float jumbForce = 300f;
    // Start is called before the first frame update
    void Start()
    {
        sr = GetComponent<SpriteRenderer>();
        rb = GetComponent<Rigidbody2D>();
    }

    // Update is called once per frame
    void Update()
    {//موقع الاعب 
        Ho = Input.GetAxis("Horizontal");

        if (Ho > 0)
        {
            sr.flipX = false;
        }
        if (Ho < 0)
        {
            sr.flipX = true;
        }
        transform.position += new Vector3(Ho * speed, 0, 0);

        if (Input.GetKeyDown(KeyCode.Space))
        {
            rb.AddForce(new Vector2(0, jumbForce));
        }
    }
}using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class player : MonoBehaviour
{

    float Ho;
    public float speed = 0.05f;
    SpriteRenderer sr;
    Rigidbody2D rb;
    public float jumbForce = 300f;
    // Start is called before the first frame update
    void Start()
    {
        sr = GetComponent<SpriteRenderer>();
        rb = GetComponent<Rigidbody2D>();
    }

    // Update is called once per frame
    void Update()
    {//موقع الاعب 
        Ho = Input.GetAxis("Horizontal");

        if (Ho > 0)
        {
            sr.flipX = false;
        }
        if (Ho < 0)
        {
            sr.flipX = true;
        }
        transform.position += new Vector3(Ho * speed, 0, 0);

        if (Input.GetKeyDown(KeyCode.Space))
        {
            rb.AddForce(new Vector2(0, jumbForce));
        }
    }
}